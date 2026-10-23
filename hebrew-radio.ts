namespace israel {

    // Everything this extension sends by radio travels as a small buffer packet.
    // The radio library keeps one handler per packet type, so using buffers leaves
    // the regular radio blocks (number, name and value, string) free for the program.
    const KIND_MORSE = 1;
    const KIND_TEXT = 2;
    const KIND_SHOW = 3;
    // text packet: kind, message id, part, number of parts, then one byte per letter
    const TEXT_HEADER = 4;
    const TEXT_PART = 15;
    // what a show packet asks for
    const SHOW_ANIMATION = 0;
    const SHOW_SYMBOL = 1;
    const SHOW_PICTURE = 2;

    let listening = false;
    let morseHandler: (symbol: number) => void = null;
    let textHandler: (text: string) => void = null;
    let showHandler: () => void = null;
    let textId = -1;
    let textNext = 0;
    let textSoFar = "";
    let shownKind = -1;
    let shownItem = 0;

    function listen(): void {
        if (listening) return;
        listening = true;
        radio.onReceivedBuffer(function (packet: Buffer) {
            const kind = packet[0];
            if (kind == KIND_MORSE) {
                if (morseHandler) morseHandler(packet[1]);
            } else if (kind == KIND_TEXT) {
                receiveTextPart(packet);
            } else if (kind == KIND_SHOW) {
                shownKind = packet[1];
                shownItem = packet[2];
                if (showHandler) showHandler();
            }
        });
    }

    function receiveTextPart(packet: Buffer): void {
        const part = packet[2];
        if (part == 0) {
            textId = packet[1];
            textNext = 0;
            textSoFar = "";
        }
        // a lost part spoils the message: wait for the next one
        if (packet[1] != textId || part != textNext) return;
        for (let i = TEXT_HEADER; i < packet.length; i++) {
            const b = packet[i];
            textSoFar += String.fromCharCode(b >= 0x90 ? b + 0x0500 : b);
        }
        textNext++;
        if (textNext == packet[3]) {
            textId = -1;
            if (textHandler) textHandler(textSoFar);
        }
    }

    function sendShow(kind: number, item: number): void {
        const packet = control.createBuffer(3);
        packet[0] = KIND_SHOW;
        packet[1] = kind;
        packet[2] = item;
        radio.sendBuffer(packet);
    }

    // used by the Morse blocks
    export function _sendMorseRadio(symbol: number): void {
        const packet = control.createBuffer(2);
        packet[0] = KIND_MORSE;
        packet[1] = symbol;
        radio.sendBuffer(packet);
    }

    export function _onMorseRadio(handler: (symbol: number) => void): void {
        morseHandler = handler;
        listen();
    }

    /**
     * Send Hebrew (or English) text by radio. Long texts are sent in a few parts.
     * @param text the text to send, eg: "שלום"
     */
    //% blockId=israel_radio_send_text block="radio send Hebrew text %text"
    //% text.defl="שלום"
    //% group="Radio" weight=100
    export function sendHebrewText(text: string): void {
        const parts = Math.max(1, Math.idiv(text.length + TEXT_PART - 1, TEXT_PART));
        const id = randint(0, 255);
        for (let p = 0; p < parts; p++) {
            const start = p * TEXT_PART;
            const n = Math.min(TEXT_PART, text.length - start);
            const packet = control.createBuffer(TEXT_HEADER + n);
            packet[0] = KIND_TEXT;
            packet[1] = id;
            packet[2] = p;
            packet[3] = parts;
            for (let i = 0; i < n; i++) packet[TEXT_HEADER + i] = hebrewCharCode(text, start + i) & 0xff;
            radio.sendBuffer(packet);
            // give the receiver time to read each part
            if (p < parts - 1) basic.pause(20);
        }
    }

    /**
     * Runs when Hebrew text arrives by radio. Show it with "show Hebrew text".
     */
    //% blockId=israel_radio_on_text block="on Hebrew text received"
    //% draggableParameters="reporter"
    //% group="Radio" weight=95
    export function onHebrewTextReceived(handler: (text: string) => void): void {
        textHandler = handler;
        listen();
    }

    /**
     * Ask the micro:bits that listen to play an animation
     * @param animation the animation to send
     */
    //% blockId=israel_radio_send_animation block="radio send animation %animation"
    //% group="Radio" weight=90
    export function sendAnimation(animation: IsraelAnimation): void {
        sendShow(SHOW_ANIMATION, animation);
    }

    /**
     * Ask the micro:bits that listen to show a symbol
     * @param symbol the symbol to send
     */
    //% blockId=israel_radio_send_symbol block="radio send symbol %symbol"
    //% group="Radio" weight=89
    export function sendSymbol(symbol: IsraelSymbol): void {
        sendShow(SHOW_SYMBOL, symbol);
    }

    /**
     * Ask the micro:bits that listen to scroll a picture
     * @param picture the picture to send
     */
    //% blockId=israel_radio_send_picture block="radio send picture %picture"
    //% group="Radio" weight=88
    export function sendPicture(picture: IsraelPicture): void {
        sendShow(SHOW_PICTURE, picture);
    }

    /**
     * Runs when an animation, symbol or picture arrives by radio.
     * Use "play what was received" to show it.
     */
    //% blockId=israel_radio_on_show block="on animation received"
    //% group="Radio" weight=85
    export function onAnimationReceived(handler: () => void): void {
        showHandler = handler;
        listen();
    }

    /**
     * Play the animation, symbol or picture that arrived last by radio
     */
    //% blockId=israel_radio_play_received block="play what was received"
    //% group="Radio" weight=84
    export function playReceived(): void {
        if (shownKind == SHOW_ANIMATION) playAnimation(shownItem);
        else if (shownKind == SHOW_SYMBOL) showSymbol(shownItem);
        else if (shownKind == SHOW_PICTURE) scrollPicture(shownItem);
    }
}
