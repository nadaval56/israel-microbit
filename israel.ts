/**
 * Israeli symbols for the micro:bit
 */
enum IsraelSymbol {
    //% block="Star of David"
    StarOfDavid,
    //% block="dreidel"
    Dreidel,
    //% block="Torah scroll"
    Torah
}

/**
 * Israeli animations
 */
enum IsraelAnimation {
    //% block="Star of David"
    StarOfDavid,
    //% block="Independence Day fireworks"
    Fireworks
}

/**
 * Ready-made Hebrew greetings
 */
enum HebrewGreeting {
    //% block="שלום (Shalom)"
    Shalom,
    //% block="ישראל (Israel)"
    Israel,
    //% block="עם ישראל חי (Am Israel Chai)"
    AmIsraelChai,
    //% block="חג עצמאות שמח (Happy Independence Day)"
    HappyIndependenceDay,
    //% block="חג שמח (Chag Sameach)"
    ChagSameach,
    //% block="שבת שלום (Shabbat Shalom)"
    ShabbatShalom,
    //% block="שנה טובה (Shana Tova)"
    ShanaTova,
    //% block="ירושלים (Jerusalem)"
    Jerusalem,
    //% block="מזל טוב (Mazal Tov)"
    MazalTov,
    //% block="תודה רבה (Toda Raba)"
    TodaRaba
}

/**
 * Israeli songs and holiday songs
 */
enum IsraeliSong {
    //% block="Am Yisrael Chai"
    AmYisraelChai,
    //% block="Sevivon (Hanukkah)"
    Sevivon,
    //% block="Maoz Tzur (Hanukkah)"
    MaozTzur,
    //% block="Chag Purim (Purim)"
    ChagPurim,
    //% block="Dayenu (Passover)"
    Dayenu,
    //% block="Eli Eli (Memorial Day)"
    EliEli,
    //% block="Vesamachta Bechagecha (Sukkot)"
    Vesamachta,
    //% block="Ushavtem Mayim (Sukkot)"
    UshavtemMayim,
    //% block="Vaamartem Ko Lechai (Lag BaOmer)"
    VaamartemKoLechai,
    //% block="Salenu Al Ktefenu (Shavuot)"
    Salenu
}

/**
 * Israeli and Zionist blocks: the Star of David,
 * Hebrew text on the LED screen, Hatikvah and holiday animations.
 */
//% weight=100 color="#0038b8" icon="" block="Israel"
//% groups='["Symbols", "Animations", "Hebrew", "Music", "Fun"]'
namespace israel {

    // ---------------------------------------------------------------------
    // Symbols
    // ---------------------------------------------------------------------

    // 5x5 patterns, rows separated by "|", one brightness digit (0-9) per LED.
    // Bright parts are the shape itself, dim parts are background details.
    function symbolPattern(symbol: IsraelSymbol): string {
        switch (symbol) {
            case IsraelSymbol.Dreidel: return "00900|99999|99999|09990|00900";
            case IsraelSymbol.Torah: return "90009|94449|94449|94449|90009";
            default: return "00900|99999|09090|99999|00900";
        }
    }

    // brightness of the LED at (x, y) in a pattern, scaled so that 9 is `level`
    function patternBrightness(pattern: string, x: number, y: number, level: number): number {
        const d = pattern.charCodeAt(y * 6 + x) - 48;
        return Math.idiv(d * level, 9);
    }

    // draw a pattern shifted down by dy rows
    function drawPattern(pattern: string, dy: number, level: number): void {
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                const sy = y - dy;
                led.plotBrightness(x, y, sy >= 0 && sy < 5 ? patternBrightness(pattern, x, sy, level) : 0);
            }
        }
    }

    /**
     * Get the 5x5 image of an Israeli symbol
     * @param symbol the symbol to draw
     */
    //% blockId=israel_symbol_image block="image of %symbol"
    //% group="Symbols" weight=80
    export function symbolImage(symbol: IsraelSymbol): Image {
        const pattern = symbolPattern(symbol);
        const img = images.createImage(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `);
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                img.setPixelBrightness(x, y, patternBrightness(pattern, x, y, 255));
            }
        }
        return img;
    }

    /**
     * Show an Israeli symbol on the LED screen
     * @param symbol the symbol to show
     */
    //% blockId=israel_show_symbol block="show %symbol"
    //% group="Symbols" weight=100
    export function showSymbol(symbol: IsraelSymbol): void {
        drawPattern(symbolPattern(symbol), 0, 255);
    }

    // ---------------------------------------------------------------------
    // Animations
    // ---------------------------------------------------------------------

    function starOfDavid(): void {
        const up = "00900|09090|09090|99999|00000";
        const down = "00000|99999|09090|09090|00900";
        for (let i = 0; i < 2; i++) {
            drawPattern(up, 0, 255);
            basic.pause(300);
            drawPattern(down, 0, 255);
            basic.pause(300);
        }
        const star = symbolPattern(IsraelSymbol.StarOfDavid);
        for (let i = 0; i < 2; i++) {
            for (let b = 40; b <= 255; b += 25) {
                drawPattern(star, 0, b);
                basic.pause(30);
            }
            for (let b = 255; b >= 40; b -= 25) {
                drawPattern(star, 0, b);
                basic.pause(30);
            }
        }
        drawPattern(star, 0, 255);
    }

    function fireworks(): void {
        for (let n = 0; n < 4; n++) {
            const cx = randint(1, 3);
            const cy = randint(1, 2);
            // the rocket goes up
            for (let y = 4; y >= cy; y--) {
                basic.clearScreen();
                led.plot(cx, y);
                basic.pause(70);
            }
            // and bursts into rings
            for (let r = 1; r <= 3; r++) {
                basic.clearScreen();
                for (let x = 0; x < 5; x++) {
                    for (let y = 0; y < 5; y++) {
                        if (Math.max(Math.abs(x - cx), Math.abs(y - cy)) == r) {
                            led.plotBrightness(x, y, 255 - (r - 1) * 80);
                        }
                    }
                }
                basic.pause(110);
            }
            basic.clearScreen();
            basic.pause(150);
        }
        showSymbol(IsraelSymbol.StarOfDavid);
    }

    /**
     * Play an Israeli animation on the LED screen
     * @param animation the animation to play
     */
    //% blockId=israel_play_animation block="play animation %animation"
    //% group="Animations" weight=100
    export function playAnimation(animation: IsraelAnimation): void {
        switch (animation) {
            case IsraelAnimation.StarOfDavid: starOfDavid(); break;
            case IsraelAnimation.Fireworks: fireworks(); break;
        }
    }

    /**
     * Light the Hanukkah candles for a given night, with flickering flames
     * @param night the night of Hanukkah, from 1 to 8, eg: 1
     */
    //% blockId=israel_hanukkiah block="light Hanukkah candles for night %night"
    //% night.min=1 night.max=8 night.defl=1
    //% group="Animations" weight=90
    export function lightHanukkiah(night: number): void {
        night = Math.max(1, Math.min(8, Math.round(night)));
        // candles 1-4 on row 1, candles 5-8 on row 0, right to left
        const xs = [4, 3, 1, 0, 4, 3, 1, 0];
        const ys = [1, 1, 1, 1, 0, 0, 0, 0];
        basic.showLeds(`
            . . . . .
            . . . . .
            # # # # #
            . . # . .
            . # # # .
            `, 0);
        // the shamash first, then each candle in turn
        led.plot(2, 0);
        basic.pause(400);
        for (let i = 0; i < night; i++) {
            led.plot(xs[i], ys[i]);
            basic.pause(400);
        }
        for (let t = 0; t < 30; t++) {
            led.plotBrightness(2, 0, randint(150, 255));
            for (let i = 0; i < night; i++) {
                led.plotBrightness(xs[i], ys[i], randint(90, 255));
            }
            basic.pause(100);
        }
        led.plotBrightness(2, 0, 255);
        for (let i = 0; i < night; i++) {
            led.plotBrightness(xs[i], ys[i], 255);
        }
    }

    // ---------------------------------------------------------------------
    // Hebrew text
    // ---------------------------------------------------------------------

    // 5-row glyphs for U+05D0 (alef) .. U+05EA (tav), rows separated by "|"
    const hebrewGlyphs = [
        "#..#|##.#|.##.|#.##|#..#", // א
        "###.|...#|...#|...#|####", // ב
        "##.|..#|..#|.##|#.#",      // ג
        "####|..#.|..#.|..#.|..#.", // ד
        "####|...#|#..#|#..#|#..#", // ה
        "##|.#|.#|.#|.#",           // ו
        "###|.#.|.#.|.#.|.#.",      // ז
        "####|#..#|#..#|#..#|#..#", // ח
        "#.##|#..#|#..#|#..#|####", // ט
        "##|.#|..|..|..",           // י
        "####|...#|...#|...#|...#", // ך
        "###.|...#|...#|...#|###.", // כ
        "#...|####|...#|..#.|.#..", // ל
        "####|#..#|#..#|#..#|####", // ם
        "#.#.|.#.#|#..#|#..#|#.##", // מ
        ".#|.#|.#|.#|.#",           // ן
        "##|.#|.#|.#|##",           // נ
        "####|#..#|#..#|#..#|.##.", // ס
        "#..#|#..#|.#.#|..#.|##..", // ע
        "####|#..#|##.#|...#|...#", // ף
        "####|#..#|##.#|...#|####", // פ
        "#..#|#.#.|##..|#...|#...", // ץ
        "#..#|#..#|.##.|..#.|####", // צ
        "####|...#|#..#|#.#.|#...", // ק
        "###.|...#|...#|...#|...#", // ר
        "#.#.#|#.#.#|#.#.#|#.#.#|#####", // ש
        "####|.#.#|.#.#|.#.#|##.#"  // ת
    ];

    const digitGlyphs = [
        "###|#.#|#.#|#.#|###",
        ".#.|##.|.#.|.#.|###",
        "##.|..#|.#.|#..|###",
        "##.|..#|.#.|..#|##.",
        "#.#|#.#|###|..#|..#",
        "###|#..|##.|..#|##.",
        ".##|#..|###|#.#|###",
        "###|..#|.#.|.#.|.#.",
        "###|#.#|###|#.#|###",
        "###|#.#|###|..#|##."
    ];

    const punctuation = " !?.,-:'\"";
    const punctuationGlyphs = [
        "..|..|..|..|..",
        "#|#|#|.|#",
        "##.|..#|.#.|...|.#.",
        ".|.|.|.|#",
        "..|..|..|.#|#.",
        "..|..|##|..|..",
        ".|#|.|#|.",
        "#|#|.|.|.",
        "#.#|#.#|...|...|..."
    ];

    function glyphFor(code: number): string {
        if (code >= 0x05D0 && code <= 0x05EA) return hebrewGlyphs[code - 0x05D0];
        if (code >= 48 && code <= 57) return digitGlyphs[code - 48];
        if (code == 0x05BE) return punctuationGlyphs[5]; // maqaf
        if (code == 0x05F3) return punctuationGlyphs[7]; // geresh
        if (code == 0x05F4) return punctuationGlyphs[8]; // gershayim
        const i = punctuation.indexOf(String.fromCharCode(code));
        if (i >= 0) return punctuationGlyphs[i];
        return "";
    }

    function addColumns(cols: number[], glyph: string): void {
        const rows = glyph.split("|");
        for (let x = 0; x < rows[0].length; x++) {
            let col = 0;
            for (let y = 0; y < 5; y++) {
                if (rows[y].charAt(x) == "#") col |= 1 << y;
            }
            cols.push(col);
        }
        cols.push(0); // gap between letters
    }

    /**
     * Turn Hebrew text into LED columns, ordered from left to right
     * as the text is seen (numbers stay left-to-right).
     */
    function hebrewColumns(text: string): number[] {
        const glyphs: string[] = [];
        const digit: boolean[] = [];
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            const g = glyphFor(code);
            // niqqud and unknown characters are skipped
            if (g) {
                glyphs.push(g);
                digit.push(code >= 48 && code <= 57);
            }
        }
        const cols: number[] = [];
        let i = glyphs.length - 1;
        while (i >= 0) {
            if (digit[i]) {
                let j = i;
                while (j >= 0 && digit[j]) j--;
                for (let k = j + 1; k <= i; k++) addColumns(cols, glyphs[k]);
                i = j;
            } else {
                addColumns(cols, glyphs[i]);
                i--;
            }
        }
        return cols;
    }

    /**
     * Scroll Hebrew text across the LED screen, from right to left reading order
     * (the text enters from the left side and moves right)
     * @param text the Hebrew text to show, eg: "שלום"
     * @param interval speed of scroll in milliseconds, eg: 120
     */
    //% blockId=israel_show_hebrew block="show Hebrew text %text||speed %interval ms"
    //% text.defl="שלום"
    //% interval.defl=120 interval.min=20 interval.max=1000
    //% expandableArgumentMode="toggle"
    //% group="Hebrew" weight=100
    export function showHebrew(text: string, interval: number = 120): void {
        const cols = hebrewColumns(text);
        const n = cols.length;
        for (let s = 0; s < n + 5; s++) {
            for (let x = 0; x < 5; x++) {
                const idx = n - 1 - s + x;
                const col = idx >= 0 && idx < n ? cols[idx] : 0;
                for (let y = 0; y < 5; y++) {
                    if (col & (1 << y)) led.plot(x, y);
                    else led.unplot(x, y);
                }
            }
            basic.pause(interval);
        }
    }

    /**
     * Get the Hebrew text of a greeting
     * @param greeting the greeting
     */
    //% blockId=israel_greeting_text block="%greeting"
    //% group="Hebrew" weight=80
    export function greetingText(greeting: HebrewGreeting): string {
        switch (greeting) {
            case HebrewGreeting.Israel: return "ישראל";
            case HebrewGreeting.AmIsraelChai: return "עם ישראל חי";
            case HebrewGreeting.HappyIndependenceDay: return "חג עצמאות שמח";
            case HebrewGreeting.ChagSameach: return "חג שמח";
            case HebrewGreeting.ShabbatShalom: return "שבת שלום";
            case HebrewGreeting.ShanaTova: return "שנה טובה";
            case HebrewGreeting.Jerusalem: return "ירושלים";
            case HebrewGreeting.MazalTov: return "מזל טוב";
            case HebrewGreeting.TodaRaba: return "תודה רבה";
            default: return "שלום";
        }
    }

    /**
     * Scroll a Hebrew greeting across the LED screen
     * @param greeting the greeting to show
     */
    //% blockId=israel_show_greeting block="show greeting %greeting"
    //% group="Hebrew" weight=90
    export function showGreeting(greeting: HebrewGreeting): void {
        showHebrew(greetingText(greeting));
    }

    // ---------------------------------------------------------------------
    // Music
    // ---------------------------------------------------------------------

    // Songs are written as "note:beats" separated by spaces, e.g. "D5:0.5 Fs5:1 R:1".
    // A note is a letter, an optional "s" (sharp) or "b" (flat) and an octave;
    // "R" is a rest. Beats are quarter notes.

    function noteFrequency(note: string): number {
        const steps = [9, 11, 0, 2, 4, 5, 7]; // A B C D E F G
        let semitone = steps[note.charCodeAt(0) - 65];
        const accidental = note.charAt(1);
        if (accidental == "s") semitone++;
        else if (accidental == "b") semitone--;
        const octave = note.charCodeAt(note.length - 1) - 48;
        const midi = 12 * (octave + 1) + semitone;
        return Math.round(440 * Math.pow(2, (midi - 69) / 12));
    }

    // Plays a song at its own tempo. The MakeCode tempo block scales it:
    // the default tempo of 120 plays the song at its natural speed.
    // Low songs can be raised by whole octaves, which the speaker plays louder.
    // Each note is cut a little short so that repeated notes are heard separately.
    function playSongText(song: string, bpm: number, octaveUp: number = 0): void {
        const beat = 60000 / bpm * 120 / music.tempo();
        const tokens = song.split(" ");
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const colon = token.indexOf(":");
            if (colon < 0) continue;
            const note = token.substr(0, colon);
            const ms = Math.round(parseFloat(token.substr(colon + 1)) * beat);
            if (note == "R") {
                music.rest(ms);
            } else {
                const gap = Math.min(60, Math.idiv(ms, 5));
                music.playTone(noteFrequency(note) * Math.pow(2, octaveUp), ms - gap);
                music.rest(gap);
            }
        }
    }

    /**
     * Play Hatikvah, the national anthem of Israel
     */
    //% blockId=israel_hatikvah block="play Hatikvah"
    //% group="Music" weight=100
    export function playHatikvah(): void {
        // Kol od ba-le-vav pe-ni-ma, ne-fesh ye-hu-di ho-mi-ya
        const verse = "D5:0.5 E5:0.5 F5:0.5 G5:0.5 A5:1 A5:1 As5:0.5 A5:0.5 As5:0.5 D6:0.5 A5:2 " +
            "G5:1 G5:0.5 G5:0.5 F5:1 F5:1 E5:0.5 D5:0.5 E5:0.5 F5:0.5 D5:1.5 A4:0.5 " +
            "D5:0.5 E5:0.5 F5:0.5 G5:0.5 A5:1 A5:1 As5:0.5 A5:0.5 As5:0.5 D6:0.5 A5:2 " +
            "G5:1 G5:0.5 G5:0.5 F5:1 F5:1 E5:0.5 D5:0.5 E5:0.5 F5:0.5 D5:2 ";
        // Od lo av-da tik-va-te-nu
        const chorus = "D5:1 D6:1 D6:1 D6:1 C6:0.5 D6:0.5 C6:0.5 As5:0.5 A5:2 " +
            "D5:1 D6:1 D6:1 D6:1 C6:0.5 D6:0.5 C6:0.5 As5:0.5 A5:2 ";
        // Lih-yot am chof-shi be-ar-tze-nu, e-retz tzi-yon vi-ru-sha-la-yim
        const ending = "G5:1 G5:0.5 G5:0.5 F5:1 F5:1 G5:0.5 A5:0.5 As5:0.5 C6:0.5 A5:1 G5:0.5 F5:0.5 " +
            "G5:1 G5:1 F5:1 F5:1 E5:0.5 D5:0.5 E5:0.5 F5:0.5 D5:2 ";
        playSongText(verse + chorus + ending + ending, 72);
    }

    /**
     * Play an Israeli song or a holiday song
     * @param song the song to play
     */
    //% blockId=israel_play_song block="play song %song"
    //% group="Music" weight=90
    export function playSong(song: IsraeliSong): void {
        switch (song) {
            case IsraeliSong.Sevivon:
                // Se-vi-von, sov sov sov, Cha-nu-ka hu chag tov
                playSongText("D5:0.5 D5:0.5 E5:1 F5:0.5 F5:0.5 E5:1 A5:0.5 A5:0.5 G5:0.25 F5:0.25 E5:0.25 D5:0.25 F5:0.5 F5:0.5 E5:1 " +
                    "D5:0.5 D5:0.5 E5:1 F5:0.5 F5:0.5 G5:1 A5:0.5 A5:0.5 A5:0.5 A4:0.5 D5:0.5 D5:0.5 D5:1 " +
                    "G5:0.5 G5:0.5 G5:0.5 As5:0.5 A5:0.5 A5:0.5 F5:0.25 E5:0.25 D5:0.5 Cs5:0.5 Cs5:0.5 A4:0.5 Cs5:0.5 D5:0.75 E5:0.25 F5:0.25 E5:0.25 D5:0.5 " +
                    "G5:0.5 G5:0.5 G5:0.5 As5:0.5 A5:1 F5:0.25 E5:0.25 D5:0.5 Cs5:0.5 Cs5:0.5 A4:0.5 Cs5:0.5 D5:0.5 D5:0.5 D5:1", 84);
                break;
            case IsraeliSong.MaozTzur: {
                // Ma-oz tzur ye-shu-a-ti, le-cha na-eh le-sha-be-ach
                const a = "F4:1 C4:1 F4:1 As4:1 A4:1 G4:1 F4:1 R:1 C5:1 D5:1 G4:1 A4:0.5 As4:0.5 ";
                // Le-et ta-chin mat-be-ach, mi-tzar ha-me-na-be-ach
                const b = "C5:1.5 C5:0.5 D5:1 E5:1 F5:2 C5:2 F5:1 E5:1 D5:1 C5:1 C5:0.5 As4:0.5 A4:0.5 As4:0.5 G4:1 R:1 ";
                // Az eg-mor be-shir miz-mor cha-nu-kat ha-miz-be-ach
                const c = "A4:1.5 As4:0.5 C5:1 R:0.5 C5:0.5 G4:1.5 A4:0.5 As4:1 R:1 A4:1 F4:1 D5:1 C5:0.5 As4:0.5 ";
                playSongText(a + "A4:1 G4:1 F4:1 R:1 " + a + "A4:1 G4:1 F4:1 R:0.5 C5:0.5 " + b +
                    c + "A4:1 As4:1 C5:1 R:1 " + c + "A4:1 G4:1 F4:2", 92, 1);
                break;
            }
            case IsraeliSong.ChagPurim: {
                // Chag Pu-rim, chag Pu-rim, chag ga-dol hu la-ye-hu-dim
                // Ma-se-chot, ra-a-sha-nim, ze-mi-rot ve-ri-ku-dim
                const verse = "F5:0.5 G5:0.5 F5:1 F5:0.5 G5:0.5 F5:1 F5:0.5 G5:0.5 F5:0.5 G5:0.5 F5:0.5 E5:0.5 D5:1 " +
                    "D5:0.5 G5:0.5 G5:1 D5:0.5 G5:0.5 G5:1 D5:0.5 G5:0.5 F5:0.5 E5:0.5 F5:2 ";
                // Ha-va na-ri-sha: rash rash rash, ba-ra-a-sha-nim
                const chorus = "A5:0.5 A5:0.25 A5:0.25 G5:0.5 F5:0.5 G5:0.5 G5:0.5 G5:1 " +
                    "G5:0.5 G5:0.25 G5:0.25 F5:0.5 D5:0.5 F5:0.5 F5:0.5 F5:1 " +
                    "A5:0.5 A5:0.25 A5:0.25 G5:0.5 F5:0.5 G5:0.5 G5:0.5 G5:1 " +
                    "D5:0.5 G5:0.5 F5:0.5 E5:0.5 D5:2";
                playSongText(verse + chorus, 100);
                break;
            }
            case IsraeliSong.Dayenu: {
                // I-lu ho-tzi-a-nu mi-mitz-ra-yim...
                const verse = "B4:0.5 D5:0.5 D5:0.5 D5:0.5 D5:0.5 E5:0.5 D5:0.5 C5:0.5 B4:0.5 D5:0.5 D5:0.5 D5:0.5 D5:0.5 E5:0.5 D5:0.5 C5:0.5 " +
                    "B4:0.5 D5:0.5 A4:0.5 C5:0.5 B4:0.5 D5:0.5 A4:0.5 C5:0.5 B4:1 A4:1 G4:1 R:1 ";
                // Da-da-ye-nu, da-da-ye-nu, da-da-ye-nu, da-ye-nu da-ye-nu
                const chorus = "B4:1 B4:1 D5:0.5 C5:1 A4:0.5 C5:1 C5:1 E5:0.5 D5:1 B4:0.5 D5:1 D5:1 G5:0.5 Fs5:1 Fs5:0.5 Fs5:0.5 D5:0.5 E5:0.5 Fs5:0.5 ";
                playSongText(verse + chorus + "G5:0.5 D5:0.5 B4:0.5 G4:0.5 " + chorus + "G5:2", 100);
                break;
            }
            case IsraeliSong.EliEli:
                // E-li, E-li, she-lo yi-ga-mer le-o-lam: ha-chol ve-ha-yam,
                // rish-rush shel ha-ma-yim, be-rak ha-sha-ma-yim, te-fi-lat ha-a-dam
                playSongText("B3:1 B4:3 Fs4:1 G4:3 E4:1 G4:1 Fs4:0.5 E4:0.5 Ds4:1 E4:0.5 Fs4:0.5 B3:3 B3:1 " +
                    "E4:2 E4:1 E4:1 Fs4:3 E4:0.5 Fs4:0.5 G4:2 G4:1 Fs4:0.5 G4:0.5 A4:2 A4:1 G4:0.5 A4:0.5 " +
                    "B4:2 B4:1 A4:0.5 B4:0.5 C5:2 C5:1 C5:1 B4:2 B4:1 A4:1 B4:3 B4:1 " +
                    "Fs4:2 G4:1 A4:1 G4:3 Fs4:0.5 E4:0.5 Ds4:2 E4:1 Fs4:1 E4:2 E4:1 E4:1 " +
                    "C5:2 D5:1 C5:1 B4:2 A4:1 G4:1 Fs4:2 G4:1 Fs4:1 E4:3", 84, 1);
                break;
            case IsraeliSong.Vesamachta: {
                // Ve-sa-mach-ta be-cha-ge-cha ve-ha-yi-ta ach sa-me-ach
                const a = "E4:0.5 E4:0.5 Fs4:0.5 E4:0.5 D4:2 Cs4:0.5 D4:0.5 E4:0.5 Fs4:0.5 E4:2 " +
                    "E4:0.5 E4:0.5 Fs4:0.5 E4:0.5 D4:2 A4:0.5 A4:0.5 G4:0.5 Fs4:0.5 ";
                const b = "G4:1 A4:1 B4:1 C5:1 D5:0.5 C5:1 B4:0.5 B4:0.5 A4:0.25 B4:0.25 A4:0.5 G4:0.5 " +
                    "B4:0.5 A4:0.5 A4:0.5 G4:0.5 ";
                playSongText(a + "G4:2 " + a + "E4:2 " + b + "G4:1 A4:1 B4:2 E5:1 R:1 " +
                    b + "G4:0.5 Fs4:0.5 Fs4:0.5 E4:0.5 E4:2", 110, 1);
                break;
            }
            case IsraeliSong.UshavtemMayim: {
                // U-sh'-av-tem ma-yim be-sa-son mi-ma-ay-nei ha-ye-shu-a
                const verse = "D5:0.25 D5:0.25 D5:0.5 E5:0.5 F5:0.25 E5:0.25 D5:0.5 F5:0.5 G5:0.5 A5:0.75 G5:0.25 " +
                    "F5:0.5 A5:0.5 C6:0.5 As5:0.5 A5:0.5 G5:0.5 A5:0.5 " +
                    "D5:0.25 D5:0.25 D5:0.5 E5:0.5 F5:0.25 E5:0.25 D5:0.5 F5:0.5 G5:0.5 A5:1 " +
                    "D6:0.5 D6:0.5 C6:0.5 C6:0.5 A5:0.5 C6:0.5 D6:1 ";
                // Ma-yim ma-yim ma-yim ma-yim, hoi ma-yim be-sa-son
                const mayim = "D6:0.5 D6:0.5 D6:0.5 D6:0.5 D6:0.5 D6:0.5 D6:0.5 D6:0.5 R:0.5 D6:0.5 C6:0.5 C6:0.5 A5:0.5 ";
                // Hei hei hei hei, ma-yim ma-yim ...
                const hei = "C6:1 C6:1 C6:1 C6:1 " +
                    "C6:0.5 C6:0.5 As5:0.25 A5:0.25 G5:0.5 C6:0.5 C6:0.5 As5:0.25 A5:0.25 G5:0.5 " +
                    "F5:0.5 G5:0.5 A5:0.25 As5:0.25 A5:0.5 G5:0.5 F5:0.5 C6:1 " +
                    "C6:0.5 C6:0.5 As5:0.25 A5:0.25 G5:0.5 C6:0.5 C6:0.5 As5:0.25 A5:0.25 G5:0.5 " +
                    "A5:0.5 A5:0.5 F5:0.25 E5:0.25 D5:0.5 F5:0.5 E5:0.5 D5:1";
                playSongText(verse + mayim + "C6:0.5 D6:1 " + mayim + "G5:0.5 A5:1 " + hei, 100);
                break;
            }
            case IsraeliSong.VaamartemKoLechai: {
                // Va-a-mar-tem ko le-chai, ra-bi shim-on bar yo-chai
                const a = "G4:0.75 A4:0.25 G4:0.25 A4:0.25 G4:0.25 A4:0.25 G4:0.5 A4:0.5 G4:1 ";
                // Kol ri-na vi-shu-a be-a-ho-lei tza-di-kim
                const b = "B4:0.75 G4:0.25 G4:0.5 G4:0.5 ";
                // Ku-lo ha-dar me-a-shan tza-dik
                const c = "G4:0.5 G4:0.5 G4:0.25 A4:0.25 G4:0.25 Fs4:0.25 E4:0.5 B3:0.5 E4:1.5 R:0.5 ";
                playSongText(a + "G4:0.5 Fs4:0.5 E4:0.5 E4:0.25 A4:0.25 G4:0.5 Fs4:0.5 E4:1 " +
                    a + "G4:0.5 G4:0.5 A4:0.5 A4:0.25 C5:0.25 B4:0.5 A4:0.5 G4:1.5 R:0.5 " +
                    "G4:1 G4:0.5 G4:0.5 G4:0.5 G4:0.5 G4:0.25 A4:0.25 G4:0.25 G4:0.25 " +
                    "G4:0.25 Fs4:0.25 E4:0.5 Fs4:0.5 G4:0.5 E4:0.5 B3:0.5 E4:1 " +
                    b + "B4:0.75 G4:0.25 G4:0.5 R:0.25 G4:0.25 G4:0.5 G4:0.5 A4:0.5 A4:0.25 C5:0.25 B4:0.5 A4:0.25 B4:0.25 G4:1 " +
                    c + c +
                    "G4:0.5 G4:0.5 G4:0.5 G4:0.25 G4:0.25 G4:0.5 G4:0.5 A4:1 " +
                    "A4:0.5 A4:0.5 A4:0.5 A4:0.25 A4:0.25 G4:0.5 E4:0.5 G4:2", 100, 1);
                break;
            }
            case IsraeliSong.Salenu: {
                // Sa-le-nu al ke-te-fe-nu, ra-shei-nu a-tu-rim
                const a = "C4:0.5 G4:1 E4:0.5 F4:0.5 E4:0.5 D4:0.5 C4:0.5 D4:0.5 F4:1 E4:0.5 D4:0.5 C4:0.5 ";
                // Hach hach ba-tof, ve-hach ba-cha-lil
                const hach = "G4:0.5 R:0.5 E4:0.5 R:0.5 F4:0.5 E4:0.5 D4:1 C4:0.5 F4:0.5 E4:0.5 D4:0.5 ";
                playSongText(a + "E4:1 " + a + "C4:1 " +
                    // Mi-ye-hu-da u-mi-shom-ron, min ha-e-mek ve-ha-ga-lil
                    "G4:1 G4:1 G4:2 As4:0.5 A4:0.5 G4:0.5 F4:0.5 E4:0.5 F4:0.5 G4:1 " +
                    "G4:0.5 R:0.5 G4:0.5 R:0.5 G4:0.5 R:0.5 G4:0.5 R:0.5 " +
                    "As4:0.5 A4:0.5 G4:0.5 F4:0.25 F4:0.25 E4:0.5 F4:0.5 G4:1 " +
                    // Pi-nu de-rech la-nu, bi-ku-rim i-ta-nu
                    "C4:0.5 F4:0.5 F4:0.5 F4:0.5 F4:1 E4:0.5 D4:0.5 C4:0.5 E4:0.5 E4:0.5 E4:0.5 E4:1 D4:0.5 C4:0.5 " +
                    hach + "G4:2 " + hach + "C4:2", 100, 1);
                break;
            }
            default: {
                // Am Yis-ra-el chai, Am Yis-ra-el chai, Am Yis-ra-el, Am Yis-ra-el, Am Yis-ra-el chai
                const a = "A4:0.5 A4:0.5 G4:0.5 E4:0.5 A4:2 A4:0.5 A4:0.5 G4:0.5 E4:0.5 A4:2 " +
                    "C5:0.5 C5:0.5 B4:0.5 A4:0.5 C5:0.5 C5:0.5 B4:0.5 A4:0.5 D5:0.5 D5:0.5 B4:0.5 G4:0.5 ";
                // Od a-vi-nu chai, od a-vi-nu chai, ...
                const b = "E5:0.5 E5:0.5 E5:0.5 E5:0.5 E5:0.5 E5:0.5 E5:0.5 E5:0.5 D5:0.5 E5:0.5 D5:0.5 B4:0.5 G4:2 " +
                    "D5:0.5 D5:0.5 D5:0.5 D5:0.5 D5:0.5 D5:0.5 D5:0.5 D5:0.5 E5:0.5 D5:0.5 C5:0.5 B4:0.5 ";
                // each part is played twice, with a different ending the second time
                playSongText(a + "A4:2 " + a + "A4:1 R:1 " + b + "A4:1 R:1 " + b + "A4:2", 120);
                break;
            }
        }
    }

    /**
     * Play "Am Yisrael Chai" by Shlomo Carlebach
     */
    //% blockId=israel_am_yisrael_chai block="play Am Yisrael Chai"
    //% group="Music" weight=80 blockHidden=true
    export function playAmYisraelChai(): void {
        playSong(IsraeliSong.AmYisraelChai);
    }

    // ---------------------------------------------------------------------
    // Fun
    // ---------------------------------------------------------------------

    /**
     * The age of the State of Israel (founded in 1948) in a given year
     * @param year the year, eg: 2026
     */
    //% blockId=israel_age block="Israel's age in year %year"
    //% year.defl=2026
    //% group="Fun" weight=100
    export function israelAge(year: number): number {
        return year - 1948;
    }
}
