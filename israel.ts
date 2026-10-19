/**
 * Israeli symbols for the micro:bit
 */
enum IsraelSymbol {
    //% block="Israeli flag"
    Flag,
    //% block="Star of David"
    StarOfDavid,
    //% block="Menorah"
    Menorah,
    //% block="Hanukkiah"
    Hanukkiah,
    //% block="pomegranate"
    Pomegranate,
    //% block="Tower of David"
    TowerOfDavid,
    //% block="Torah scroll"
    Torah
}

/**
 * Israeli animations
 */
enum IsraelAnimation {
    //% block="waving flag"
    WavingFlag,
    //% block="flag raising"
    FlagRaising,
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
 * Israeli and Zionist blocks: the flag, the Star of David,
 * Hebrew text on the LED screen, Hatikvah and holiday animations.
 */
//% weight=100 color="#0038b8" icon="" block="Israel"
//% groups='["Symbols", "Animations", "Hebrew", "Music", "Fun"]'
namespace israel {

    // ---------------------------------------------------------------------
    // Symbols
    // ---------------------------------------------------------------------

    /**
     * Get the 5x5 image of an Israeli symbol
     * @param symbol the symbol to draw
     */
    //% blockId=israel_symbol_image block="image of %symbol"
    //% group="Symbols" weight=80
    export function symbolImage(symbol: IsraelSymbol): Image {
        switch (symbol) {
            case IsraelSymbol.StarOfDavid: return images.createImage(`
                . . # . .
                # # # # #
                . # . # .
                # # # # #
                . . # . .
                `);
            case IsraelSymbol.Menorah: return images.createImage(`
                # . # . #
                # . # . #
                # # # # #
                . . # . .
                . # # # .
                `);
            case IsraelSymbol.Hanukkiah: return images.createImage(`
                # # # # #
                # # . # #
                # # # # #
                . . # . .
                . # # # .
                `);
            case IsraelSymbol.Pomegranate: return images.createImage(`
                . # . # .
                . . # . .
                . # # # .
                # # # # #
                . # # # .
                `);
            case IsraelSymbol.TowerOfDavid: return images.createImage(`
                . . # . .
                . # # # .
                . # . # .
                # # # # #
                # # # # #
                `);
            case IsraelSymbol.Torah: return images.createImage(`
                # . . . #
                # # # # #
                # . # . #
                # # # # #
                # . . . #
                `);
            default: return images.createImage(`
                # # # # #
                . . # . .
                . # . # .
                . . # . .
                # # # # #
                `);
        }
    }

    /**
     * Show an Israeli symbol on the LED screen
     * @param symbol the symbol to show
     */
    //% blockId=israel_show_symbol block="show %symbol"
    //% group="Symbols" weight=100
    export function showSymbol(symbol: IsraelSymbol): void {
        symbolImage(symbol).showImage(0);
    }

    /**
     * Show the flag of Israel on the LED screen
     */
    //% blockId=israel_show_flag block="show Israeli flag"
    //% group="Symbols" weight=110
    export function showFlag(): void {
        showSymbol(IsraelSymbol.Flag);
    }

    // ---------------------------------------------------------------------
    // Animations
    // ---------------------------------------------------------------------

    function drawImage(img: Image, dy: number, brightness: number): void {
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                const sy = y - dy;
                const on = sy >= 0 && sy < 5 && img.pixel(x, sy);
                led.plotBrightness(x, y, on ? brightness : 0);
            }
        }
    }

    function wave(img: Image, frames: number): void {
        // a band of light runs across the image, like a flag in the wind
        const levels = [255, 190, 110, 50, 110, 190];
        for (let t = 0; t < frames; t++) {
            for (let x = 0; x < 5; x++) {
                const b = levels[(t + 6 - x) % 6];
                for (let y = 0; y < 5; y++) {
                    led.plotBrightness(x, y, img.pixel(x, y) ? b : 0);
                }
            }
            basic.pause(90);
        }
    }

    function flagRaising(): void {
        const flag = symbolImage(IsraelSymbol.Flag);
        for (let dy = 5; dy >= 0; dy--) {
            drawImage(flag, dy, 255);
            basic.pause(250);
        }
        wave(flag, 18);
        drawImage(flag, 0, 255);
    }

    function starOfDavid(): void {
        const up = images.createImage(`
            . . # . .
            . # . # .
            . # . # .
            # # # # #
            . . . . .
            `);
        const down = images.createImage(`
            . . . . .
            # # # # #
            . # . # .
            . # . # .
            . . # . .
            `);
        for (let i = 0; i < 2; i++) {
            up.showImage(0);
            basic.pause(300);
            down.showImage(0);
            basic.pause(300);
        }
        const star = symbolImage(IsraelSymbol.StarOfDavid);
        for (let i = 0; i < 2; i++) {
            for (let b = 40; b <= 255; b += 25) {
                drawImage(star, 0, b);
                basic.pause(30);
            }
            for (let b = 255; b >= 40; b -= 25) {
                drawImage(star, 0, b);
                basic.pause(30);
            }
        }
        drawImage(star, 0, 255);
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
        showFlag();
    }

    /**
     * Play an Israeli animation on the LED screen
     * @param animation the animation to play
     */
    //% blockId=israel_play_animation block="play animation %animation"
    //% group="Animations" weight=100
    export function playAnimation(animation: IsraelAnimation): void {
        switch (animation) {
            case IsraelAnimation.WavingFlag:
                wave(symbolImage(IsraelSymbol.Flag), 30);
                showFlag();
                break;
            case IsraelAnimation.FlagRaising: flagRaising(); break;
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

    /**
     * Play the opening of Hatikvah, the national anthem of Israel
     */
    //% blockId=israel_hatikvah block="play Hatikvah"
    //% group="Music" weight=100
    export function playHatikvah(): void {
        // Kol od ba-le-vav pe-ni-ma, ne-fesh ye-hu-di ho-mi-ya
        const notes = [
            Note.A, Note.B, Note.C5, Note.D5, Note.E5, Note.E5,
            Note.F5, Note.E5, Note.F5, Note.A5, Note.E5,
            Note.D5, Note.D5, Note.C5, Note.C5, Note.B, Note.A, Note.B, Note.C5, Note.A
        ];
        const beats = [
            1, 1, 1, 1, 2, 2,
            1, 1, 1, 1, 4,
            2, 1, 1, 2, 1, 1, 1, 1, 4
        ];
        const beat = music.beat(BeatFraction.Whole);
        for (let i = 0; i < notes.length; i++) {
            music.playTone(notes[i], beats[i] * beat);
        }
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
