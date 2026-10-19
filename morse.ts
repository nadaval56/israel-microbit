/**
 * How Morse code is played: with sound, light or both
 */
enum MorseOutput {
    //% block="sound and light"
    SoundAndLight,
    //% block="sound"
    Sound,
    //% block="light"
    Light
}

namespace israel {

    // Hebrew Morse code for U+05D0 (alef) .. U+05EA (tav).
    // Final letters share the code of the regular letter.
    const hebrewMorse = [
        ".-", "-...", "--.", "-..", "---", ".", "--..", "....", "..-", "..", // א-י
        "-.-", "-.-", ".-..", "--", "--", "-.", "-.", "-.-.", ".---", ".--.", // ך כ ל ם מ ן נ ס ע ף
        ".--.", ".--", ".--", "--.-", ".-.", "...", "-" // פ ץ צ ק ר ש ת
    ];
    const latinMorse = [
        ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--",
        "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.."
    ];
    const digitMorse = [
        "-----", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----."
    ];
    // letters used when decoding (no final forms)
    const hebrewLetters = "אבגדהוזחטיכלמנסעפצקרשת";

    // what is sent over the radio, one value per symbol
    const DOT = 1;
    const DASH = 2;
    const LETTER_END = 3;
    const WORD_END = 4;
    const RADIO_KEY = "morse";
    const TONE = 700;

    let unit = 120;
    let output = MorseOutput.SoundAndLight;
    let receiving = false;
    let incoming: number[] = [];

    function charMorse(code: number): string {
        if (code >= 0x05D0 && code <= 0x05EA) return hebrewMorse[code - 0x05D0];
        if (code >= 65 && code <= 90) return latinMorse[code - 65];
        if (code >= 97 && code <= 122) return latinMorse[code - 97];
        if (code >= 48 && code <= 57) return digitMorse[code - 48];
        return "";
    }

    function textToSymbols(text: string): number[] {
        const symbols: number[] = [];
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            if (code == 32) {
                if (symbols.length > 0 && symbols[symbols.length - 1] == LETTER_END) symbols.push(WORD_END);
                continue;
            }
            const m = charMorse(code);
            for (let j = 0; j < m.length; j++) symbols.push(m.charAt(j) == "." ? DOT : DASH);
            if (m.length > 0) symbols.push(LETTER_END);
        }
        return symbols;
    }

    function drawSign(dash: boolean): void {
        basic.clearScreen();
        if (dash) {
            for (let x = 0; x < 5; x++) led.plot(x, 2);
        } else {
            led.plot(2, 1);
            led.plot(1, 2);
            led.plot(2, 2);
            led.plot(3, 2);
            led.plot(2, 3);
        }
    }

    // Plays one symbol with the standard timing: a dot is one unit, a dash three,
    // one unit between signs, three between letters and seven between words.
    function playSymbol(symbol: number): void {
        if (symbol == DOT || symbol == DASH) {
            const ms = symbol == DOT ? unit : 3 * unit;
            if (output != MorseOutput.Sound) drawSign(symbol == DASH);
            if (output != MorseOutput.Light) music.playTone(TONE, ms);
            else basic.pause(ms);
            if (output != MorseOutput.Sound) basic.clearScreen();
            basic.pause(unit);
        } else if (symbol == LETTER_END) {
            basic.pause(2 * unit);
        } else if (symbol == WORD_END) {
            basic.pause(4 * unit);
        }
    }

    // Shows a single Hebrew letter (or "?") in the middle of the screen
    function showLetter(letter: string): void {
        const cols = hebrewColumns(letter);
        const width = cols.length - 1; // the last column is the gap after the letter
        const left = Math.idiv(5 - width, 2);
        basic.clearScreen();
        for (let i = 0; i < width; i++) {
            for (let y = 0; y < 5; y++) {
                if (cols[i] & (1 << y)) led.plot(left + i, y);
            }
        }
    }

    function decodeLetter(code: string): string {
        for (let i = 0; i < hebrewLetters.length; i++) {
            if (hebrewMorse[hebrewLetters.charCodeAt(i) - 0x05D0] == code) return hebrewLetters.charAt(i);
        }
        for (let d = 0; d < 10; d++) {
            if (digitMorse[d] == code) return String.fromCharCode(48 + d);
        }
        return "?";
    }

    // ---------------------------------------------------------------------
    // Encoder
    // ---------------------------------------------------------------------

    /**
     * Play text as Morse code with beeps and flashes, without showing the text
     * @param text the Hebrew (or English) text, eg: "שלום"
     */
    //% blockId=israel_play_morse block="play Morse code %text"
    //% text.defl="שלום"
    //% group="Morse" weight=100
    export function playMorse(text: string): void {
        const symbols = textToSymbols(text);
        for (let i = 0; i < symbols.length; i++) playSymbol(symbols[i]);
    }

    /**
     * Set the length of a dot. A dash is three times longer.
     * @param ms the length of a dot in milliseconds, eg: 120
     */
    //% blockId=israel_morse_speed block="set Morse dot length to %ms ms"
    //% ms.defl=120 ms.min=40 ms.max=600
    //% group="Morse" weight=90
    export function setMorseSpeed(ms: number): void {
        unit = Math.max(20, ms);
    }

    /**
     * Choose whether Morse code is played with sound, light or both
     * @param mode sound, light or both
     */
    //% blockId=israel_morse_output block="play Morse with %mode"
    //% group="Morse" weight=85
    export function setMorseOutput(mode: MorseOutput): void {
        output = mode;
    }

    /**
     * The Morse code of a text: letters are separated by spaces and words by "/"
     * @param text the text to convert, eg: "שלום"
     */
    //% blockId=israel_text_to_morse block="Morse code of %text"
    //% text.defl="שלום"
    //% group="Morse" weight=80
    export function textToMorse(text: string): string {
        const parts: string[] = [];
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            if (code == 32) {
                if (parts.length > 0 && parts[parts.length - 1] != "/") parts.push("/");
                continue;
            }
            const m = charMorse(code);
            if (m.length > 0) parts.push(m);
        }
        if (parts.length > 0 && parts[parts.length - 1] == "/") parts.pop();
        return parts.join(" ");
    }

    /**
     * Decode Morse code into Hebrew letters: letters separated by spaces, words by "/"
     * @param code the Morse code, eg: "... .-.. . --"
     */
    //% blockId=israel_morse_to_text block="decode Morse %code"
    //% code.defl="... .-.. . --"
    //% group="Morse" weight=75
    export function morseToText(code: string): string {
        let text = "";
        const parts = code.split(" ");
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (part.length == 0) continue;
            if (part == "/") {
                text = withFinalLetter(text) + " ";
            } else {
                text += decodeLetter(part);
            }
        }
        return withFinalLetter(text);
    }

    // כ מ נ פ צ take their final form at the end of a word
    function withFinalLetter(text: string): string {
        if (text.length == 0) return text;
        const i = "כמנפצ".indexOf(text.charAt(text.length - 1));
        if (i < 0) return text;
        return text.substr(0, text.length - 1) + "ךםןףץ".charAt(i);
    }

    // ---------------------------------------------------------------------
    // Radio
    // ---------------------------------------------------------------------

    /**
     * Use a radio group for Morse code. Micro:bits talk to each other only on the same group.
     * @param id the radio group, eg: 1
     */
    //% blockId=israel_morse_group block="set Morse radio group %id"
    //% id.min=0 id.max=255 id.defl=1
    //% group="Morse" weight=70
    export function setMorseRadioGroup(id: number): void {
        radio.setGroup(id);
    }

    /**
     * Start receiving Morse code by radio. Received signals are played as beeps and
     * flashes only, so the listeners decode the message themselves.
     */
    //% blockId=israel_morse_receive block="receive Morse by radio"
    //% group="Morse" weight=65
    export function receiveMorse(): void {
        if (receiving) return;
        receiving = true;
        radio.onReceivedValue(function (name: string, value: number) {
            if (name == RADIO_KEY) incoming.push(value);
        });
        control.inBackground(function () {
            while (true) {
                if (incoming.length > 0) playSymbol(incoming.shift());
                else basic.pause(20);
            }
        });
    }

    /**
     * Send text as Morse code by radio. The sender only flashes the signs;
     * the receiving micro:bit beeps and flashes them.
     * @param text the text to send, eg: "שלום"
     */
    //% blockId=israel_morse_send block="send Morse by radio %text"
    //% text.defl="שלום"
    //% group="Morse" weight=60
    export function sendMorse(text: string): void {
        const symbols = textToSymbols(text);
        const saved = output;
        output = MorseOutput.Light;
        for (let i = 0; i < symbols.length; i++) {
            radio.sendValue(RADIO_KEY, symbols[i]);
            playSymbol(symbols[i]);
        }
        output = saved;
    }

    // ---------------------------------------------------------------------
    // Telegraph
    // ---------------------------------------------------------------------

    /**
     * Turn the micro:bit into a telegraph key: button A sends a dot, B a dash,
     * A+B ends a letter (and shows it), and shaking sends a space between words.
     * It also plays the Morse code that other telegraphs send.
     */
    //% blockId=israel_morse_telegraph block="start Morse telegraph"
    //% group="Morse" weight=55
    export function startTelegraph(): void {
        receiveMorse();
        let current = "";
        input.onButtonPressed(Button.A, function () {
            current += ".";
            radio.sendValue(RADIO_KEY, DOT);
            playSymbol(DOT);
        });
        input.onButtonPressed(Button.B, function () {
            current += "-";
            radio.sendValue(RADIO_KEY, DASH);
            playSymbol(DASH);
        });
        input.onButtonPressed(Button.AB, function () {
            if (current.length == 0) return;
            radio.sendValue(RADIO_KEY, LETTER_END);
            showLetter(decodeLetter(current));
            current = "";
            basic.pause(4 * unit);
            basic.clearScreen();
        });
        input.onGesture(Gesture.Shake, function () {
            radio.sendValue(RADIO_KEY, WORD_END);
        });
    }
}
