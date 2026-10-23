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

/**
 * Morse signals that travel over the radio
 */
enum MorseSignal {
    //% block="dot"
    Dot,
    //% block="dash"
    Dash,
    //% block="end of letter"
    LetterEnd,
    //% block="end of word"
    WordEnd
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
    // received signals as text: dot, dash, end of letter, end of word
    const signalText = [".", "-", " ", "/"];
    let shownSign = 0;

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
            const code = hebrewCharCode(text, i);
            if (code == 32) {
                if (symbols.length > 0 && symbols[symbols.length - 1] == LETTER_END) symbols.push(WORD_END);
                continue;
            }
            const m = charMorse(code);
            for (let j = 0; j < m.length; j++) symbols.push(m.charAt(j) == "." ? DOT : DASH);
            if (m.length > 0) symbols.push(LETTER_END);
        }
        // the message ends with the end of its last word
        if (symbols.length > 0 && symbols[symbols.length - 1] == LETTER_END) symbols.push(WORD_END);
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

    function decodeLetter(code: string): string {
        for (let i = 0; i < hebrewLetters.length; i++) {
            if (hebrewMorse[hebrewCharCode(hebrewLetters, i) - 0x05D0] == code) return hebrewLetters.charAt(i);
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
            const code = hebrewCharCode(text, i);
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
     * Runs when a Morse signal arrives by radio. The signal is "." (dot), "-" (dash),
     * " " (end of letter) or "/" (end of word).
     */
    //% blockId=israel_on_morse block="on Morse signal received"
    //% draggableParameters="reporter"
    //% group="Morse" weight=68
    export function onMorseReceived(handler: (signal: string) => void): void {
        radio.onReceivedValue(function (name: string, value: number) {
            if (name == RADIO_KEY && value >= DOT && value <= WORD_END) handler(signalText[value - 1]);
        });
    }

    /**
     * A Morse signal as text, to compare with a received signal
     * @param kind dot, dash, end of letter or end of word
     */
    //% blockId=israel_morse_signal block="Morse %kind"
    //% group="Morse" weight=67
    export function morseSignal(kind: MorseSignal): string {
        return signalText[kind];
    }

    /**
     * Flash a Morse signal on the LEDs: a small plus for a dot, a line for a dash.
     * The program goes on while the sign is shown, so a sound can play at the same time.
     * @param signal the signal, eg: "."
     */
    //% blockId=israel_show_morse_signal block="show Morse signal %signal"
    //% signal.defl="."
    //% group="Morse" weight=66
    export function showMorseSignal(signal: string): void {
        if (signal != "." && signal != "-") {
            basic.clearScreen();
            return;
        }
        const ms = signal == "." ? unit : 3 * unit;
        drawSign(signal == "-");
        shownSign++;
        const sign = shownSign;
        control.inBackground(function () {
            basic.pause(ms);
            if (sign == shownSign) basic.clearScreen();
        });
    }

    /**
     * Beep a Morse signal: short for a dot, long for a dash
     * @param signal the signal, eg: "."
     */
    //% blockId=israel_play_morse_signal block="play Morse signal sound %signal"
    //% signal.defl="."
    //% group="Morse" weight=65
    export function playMorseSignal(signal: string): void {
        if (signal == ".") music.playTone(TONE, unit);
        else if (signal == "-") music.playTone(TONE, 3 * unit);
    }

    /**
     * Send text as Morse code by radio, one signal at a time. The sender only
     * flashes the signs; the receivers decide what to do with each signal.
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
    // Telegraph: building blocks for your own Morse key
    // ---------------------------------------------------------------------

    let keyed = "";
    let lastLetter = "";

    function sendSign(symbol: number): void {
        radio.sendValue(RADIO_KEY, symbol);
        playSymbol(symbol);
    }

    /**
     * Send a Morse dot by radio and play it here
     */
    //% blockId=israel_morse_dot block="Morse: send dot"
    //% group="Morse" weight=55
    export function sendDot(): void {
        keyed += ".";
        sendSign(DOT);
    }

    /**
     * Send a Morse dash by radio and play it here
     */
    //% blockId=israel_morse_dash block="Morse: send dash"
    //% group="Morse" weight=54
    export function sendDash(): void {
        keyed += "-";
        sendSign(DASH);
    }

    /**
     * End the letter made of the dots and dashes sent so far
     */
    //% blockId=israel_morse_end_letter block="Morse: end letter"
    //% group="Morse" weight=53
    export function endLetter(): void {
        if (keyed.length == 0) return;
        lastLetter = decodeLetter(keyed);
        keyed = "";
        sendSign(LETTER_END);
    }

    /**
     * End the word: the next letter starts a new word
     */
    //% blockId=israel_morse_end_word block="Morse: end word"
    //% group="Morse" weight=52
    export function endWord(): void {
        if (keyed.length > 0) endLetter();
        sendSign(WORD_END);
    }

    /**
     * The Hebrew letter that was sent last with "end letter" ("?" if the code is not a letter)
     */
    //% blockId=israel_morse_last_letter block="last letter sent in Morse"
    //% group="Morse" weight=51
    export function lastLetterSent(): string {
        return lastLetter;
    }
}
