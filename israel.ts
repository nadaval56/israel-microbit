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
 * Wide pictures that scroll across the screen
 */
enum IsraelPicture {
    //% block="Hanukkiah"
    Hanukkiah,
    //% block="Menorah"
    Menorah,
    //% block="Israeli flag"
    Flag,
    //% block="Jerusalem"
    Jerusalem
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
 * Israeli and Zionist blocks: the Star of David,
 * Hebrew text on the LED screen, Hatikvah and holiday animations.
 */
//% weight=100 color="#0038b8" icon="" block="Israel"
//% groups='["Symbols", "Animations", "Hebrew", "Music", "Morse", "Fun"]'
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
        // the outline of the star, clockwise from the top point
        const ringX = [2, 3, 4, 3, 4, 3, 2, 1, 0, 1, 0, 1];
        const ringY = [0, 1, 1, 2, 3, 3, 4, 3, 3, 2, 1, 1];
        const star = symbolPattern(IsraelSymbol.StarOfDavid);
        // build the star point by point
        basic.clearScreen();
        for (let i = 0; i < 12; i++) {
            led.plotBrightness(ringX[i], ringY[i], 255);
            basic.pause(70);
        }
        led.plotBrightness(2, 1, 255);
        led.plotBrightness(2, 3, 255);
        basic.pause(200);
        // a bright light with a tail runs around the dim star
        for (let t = 0; t < 24; t++) {
            drawPattern(star, 0, 40);
            led.plotBrightness(ringX[(t + 10) % 12], ringY[(t + 10) % 12], 90);
            led.plotBrightness(ringX[(t + 11) % 12], ringY[(t + 11) % 12], 160);
            led.plotBrightness(ringX[t % 12], ringY[t % 12], 255);
            basic.pause(70);
        }
        // twinkle
        for (let t = 0; t < 16; t++) {
            drawPattern(star, 0, 70);
            for (let k = 0; k < 3; k++) {
                const i = randint(0, 11);
                led.plotBrightness(ringX[i], ringY[i], 255);
            }
            basic.pause(90);
        }
        // pulse and stay lit
        for (let b = 40; b <= 255; b += 25) {
            drawPattern(star, 0, b);
            basic.pause(30);
        }
        for (let b = 255; b >= 40; b -= 25) {
            drawPattern(star, 0, b);
            basic.pause(30);
        }
        for (let b = 40; b <= 255; b += 25) {
            drawPattern(star, 0, b);
            basic.pause(30);
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

    // Wide pictures: rows separated by "|", one brightness digit (0-9) per LED
    function picturePattern(picture: IsraelPicture): string {
        switch (picture) {
            case IsraelPicture.Menorah: return "9090909090909|4040404040404|4040404040404|3555555555553|0000055500000";
            case IsraelPicture.Flag: return "333333393333333|000009999900000|000000909000000|000009999900000|333333393333333";
            case IsraelPicture.Jerusalem: return "000900000000000000|009990000005550000|009090000055555000|" +
                "959595959595959595|999999999999999999";
            default: return hanukkiahPattern(8);
        }
    }

    // A hanukkiah 17 LEDs wide: eight candles with the shamash raised in the middle.
    // Candles are lit from right to left, one more each night.
    function hanukkiahPattern(night: number): string {
        const order = [16, 14, 12, 10, 6, 4, 2, 0];
        let flames = "";
        let candles = "";
        for (let x = 0; x < 17; x++) {
            let lit = false;
            for (let i = 0; i < night; i++) {
                if (order[i] == x) lit = true;
            }
            const candle = x % 2 == 0 && x != 8;
            flames += x == 8 ? "4" : lit ? "9" : "0";
            candles += candle || x == 8 ? "4" : "0";
        }
        return "00000000900000000|" + flames + "|" + candles + "|55555555555555555|00000005550000000";
    }

    // Scrolls a pattern from right to left across the screen
    function scrollPattern(pattern: string, interval: number): void {
        const rows = pattern.split("|");
        const width = rows[0].length;
        for (let s = 0; s <= width + 4; s++) {
            for (let x = 0; x < 5; x++) {
                const col = s + x - 4;
                for (let y = 0; y < 5; y++) {
                    const d = col >= 0 && col < width ? rows[y].charCodeAt(col) - 48 : 0;
                    led.plotBrightness(x, y, Math.idiv(d * 255, 9));
                }
            }
            basic.pause(interval);
        }
    }

    /**
     * Scroll a wide picture across the screen
     * @param picture the picture to scroll
     * @param interval speed of scroll in milliseconds, eg: 150
     */
    //% blockId=israel_scroll_picture block="scroll picture %picture||speed %interval ms"
    //% interval.defl=150 interval.min=20 interval.max=1000
    //% expandableArgumentMode="toggle"
    //% group="Animations" weight=95
    export function scrollPicture(picture: IsraelPicture, interval: number = 150): void {
        scrollPattern(picturePattern(picture), interval);
    }

    /**
     * Scroll a hanukkiah with the candles of a given night lit
     * @param night the night of Hanukkah, from 1 to 8, eg: 1
     * @param interval speed of scroll in milliseconds, eg: 150
     */
    //% blockId=israel_scroll_hanukkiah block="scroll Hanukkiah for night %night||speed %interval ms"
    //% night.min=1 night.max=8 night.defl=1
    //% interval.defl=150 interval.min=20 interval.max=1000
    //% expandableArgumentMode="toggle"
    //% group="Animations" weight=93
    export function scrollHanukkiah(night: number, interval: number = 150): void {
        scrollPattern(hanukkiahPattern(Math.max(0, Math.min(8, Math.round(night)))), interval);
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

    /**
     * The character code at a position, with Hebrew restored. On the micro:bit
     * itself, text is stored one byte per character, so Hebrew (U+0590..U+05FF)
     * arrives as 0x90..0xFF. The simulator keeps the full code.
     */
    //% blockHidden=true
    export function hebrewCharCode(text: string, i: number): number {
        const code = text.charCodeAt(i);
        return code >= 0x90 && code <= 0xFF ? code + 0x0500 : code;
    }

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
            const code = hebrewCharCode(text, i);
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
