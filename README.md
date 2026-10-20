# 🇮🇱 ישראל – בלוקים ישראליים למיקרוביט

הרחבה ל-[MakeCode](https://makecode.microbit.org) עם בלוקים בכחול-לבן: מגן דוד וסמלים,
טקסט בעברית על מסך הלדים, "התקווה", שירי חגים ואנימציות.

## איך מוסיפים את ההרחבה

1. פתחו פרויקט ב-https://makecode.microbit.org
2. לחצו על ⚙️ ← **הרחבות** (Extensions)
3. הדביקו את הכתובת **https://github.com/nadaval56/israel-microbit** בשורת החיפוש ובחרו בהרחבה
4. בארגז הכלים תופיע קטגוריה כחולה חדשה בשם **ישראל** (Israel)

> כשממשק MakeCode מוגדר לעברית, שמות הבלוקים מופיעים בעברית. בממשק באנגלית הם מופיעים באנגלית.

## הבלוקים

### סמלים
```blocks
israel.showSymbol(IsraelSymbol.StarOfDavid)
```
סמלים זמינים: מגן דוד, סביבון, ספר תורה.
הסמלים משתמשים בעוצמות אור שונות: הצורה עצמה בהירה, ופרטי רקע עמומים יותר.
הבלוק `תמונה של` מחזיר את הסמל כתמונה, לשימוש עם בלוקי התמונות של MakeCode.

### אנימציות
```blocks
israel.playAnimation(IsraelAnimation.StarOfDavid)
israel.playAnimation(IsraelAnimation.Fireworks)
israel.lightHanukkiah(3)
israel.scrollPicture(IsraelPicture.Menorah)
israel.scrollHanukkiah(5)
```
* **מגן דוד** – הכוכב נבנה נורה אחר נורה, אור עם זנב רץ סביבו, הוא מנצנץ ובסוף פועם
* **זיקוקי יום העצמאות** – זיקוקים שמתפוצצים ונגמרים במגן דוד
* **גלול תמונה** – תמונה רחבה שנגללת על המסך: חנוכייה (8 נרות ושמש), מנורת 7 קנים, דגל ישראל, ירושלים
* **גלול חנוכייה ללילה...** – חנוכייה נגללת שבה דולקים רק הנרות של אותו לילה, מימין לשמאל
* **הדלק נרות חנוכה ללילה...** – השמש נדלק, אחריו הנרות אחד אחד, עם להבות מהבהבות

### עברית על מסך הלדים
```blocks
israel.showHebrew("שלום")
israel.showGreeting(HebrewGreeting.AmIsraelChai)
```
למיקרוביט אין גופן עברי, ולכן ההרחבה כוללת גופן עברי משלה בגודל 5×5 – כל 22 האותיות וגם האותיות הסופיות.
הטקסט נגלל בכיוון הקריאה העברי: הוא נכנס מצד שמאל וזז ימינה, כך שהאות הראשונה מופיעה ראשונה.
נתמכים גם ספרות (שנשארות משמאל לימין, למשל "2026"), רווח, וסימני הפיסוק `! ? . , - : ' "`. ניקוד ותווים אחרים מדולגים.

ברכות מוכנות: שלום, ישראל, עם ישראל חי, חג עצמאות שמח, חג שמח, שבת שלום, שנה טובה, ירושלים, מזל טוב, תודה רבה.

### מוזיקה
```blocks
input.onButtonPressed(Button.A, function () {
    israel.showSymbol(IsraelSymbol.StarOfDavid)
    israel.playHatikvah()
})
input.onButtonPressed(Button.B, function () {
    israel.showSymbol(IsraelSymbol.Dreidel)
    israel.playSong(IsraeliSong.Sevivon)
})
```
* **נגן את התקווה** – ההמנון המלא
* **נגן שיר** – בוחרים שיר מהרשימה:

| שיר | מתי |
|---|---|
| עם ישראל חי (שלמה קרליבך) | כל השנה |
| סביבון | חנוכה |
| מעוז צור | חנוכה |
| חג פורים | פורים |
| ושמחת בחגך | סוכות |
| ושאבתם מים | סוכות |
| דיינו | פסח |
| בר יוחאי | ל"ג בעומר |
| סלינו על כתפינו | שבועות |
| שירת העשבים (נעמי שמר) | כל השנה |
| אלי אלי – הליכה לקיסריה | יום הזיכרון |

המנגינות שמורות בקובץ `songs.ts`, שנוצר מהגרסה הקריאה שלהן ב-`tools/make_songs.py` (שתי אותיות לכל תו, כדי שהכל ייכנס גם במיקרוביט V1).
המנגינות מתנגנות ברמקול של המיקרוביט, או ברמקול שמחובר לפין 0. בין התווים יש הפסקה קצרה, כך שתווים זהים ברצף נשמעים בנפרד.
כל שיר מתנגן בקצב הטבעי שלו. בלחיצה על "+" בבלוק אפשר לבחור מהירות באחוזים: 100 רגיל, 50 חצי מהירות, 200 כפול. בלוק "קבע קצב" (tempo) של MakeCode משנה את המהירות: 120 הוא הקצב הרגיל, מספר גדול יותר מאיץ ומספר קטן יותר מאט.

### מורס עברי
לכל אות עברית יש קוד מורס משלה (א `·–`, ב `–···`, ש `···`, ת `–` ...). האותיות הסופיות מקבלות את הקוד של האות הרגילה.
נקודה היא צפצוף קצר, קו ארוך פי שלושה, ויש הפסקות קבועות בין אותיות ובין מילים.

**1. המיקרוביט כמצפין**
```blocks
israel.setMorseSpeed(120)
israel.setMorseOutput(MorseOutput.SoundAndLight)
israel.playMorse("שלום")
```
* **נגן מורס** – הטקסט לא מוצג; במקומו יוצאים צפצופים, ובמסך מהבהבת נקודה (`+` קטן) או קו.
* **קבע אורך נקודה** – מהירות המורס. **נגן מורס עם** – צליל, אור או שניהם.
* **קוד מורס של** – מחזיר מחרוזת כמו `... .-.. . --` (רווח בין אותיות, `/` בין מילים).

**2. שליחה ברדיו** (שני מיקרוביטים באותה קבוצת רדיו, עם ההרחבה בשניהם)

השולח:
```blocks
israel.setMorseRadioGroup(7)
input.onButtonPressed(Button.A, function () {
    israel.sendMorse("חג שמח")
})
```
"שלח מורס ברדיו" שולח את ההודעה אות אחר אות, סימן אחר סימן, בקצב המורס. השולח רק מהבהב.

לבניית טלגרף משלכם יש ארבעה בלוקים, שכל אחד מהם שולח סימן ברדיו ומנגן אותו גם כאן:
* **מורס: שלח נקודה**, **מורס: שלח קו**, **מורס: סיים אות**, **מורס: סיים מילה**
* **האות האחרונה שנשלחה במורס** – האות שהוקשה, אם רוצים להציג אותה

מחליטים לבד מה מפעיל כל סימן: כפתורים, לוגו המגע, ניעור, פין, לולאות ועוד. למשל:
```blocks
israel.setMorseRadioGroup(7)
input.onButtonPressed(Button.A, function () {
    israel.sendDot()
})
input.onButtonPressed(Button.B, function () {
    israel.sendDash()
})
input.onButtonPressed(Button.AB, function () {
    israel.endLetter()
    israel.showHebrew(israel.lastLetterSent())
})
input.onGesture(Gesture.Shake, function () {
    israel.endWord()
})
```

**3. קליטה ברדיו** – המקבל מחליט מה לעשות עם כל אות שמגיע:
* **כשמתקבל אות מורס (אות)** – אירוע עם המשתנה `אות`: `.` נקודה, `-` קו, רווח לסוף אות, `/` לסוף מילה
* **הצג אות מורס בנוריות** – `+` קטן לנקודה, פס לקו. התוכנית ממשיכה לרוץ בזמן ההצגה, כך שאפשר לשים אחריו צליל והם יופיעו יחד
* **השמע אות מורס** – צפצוף קצר לנקודה, ארוך לקו
* **מורס [נקודה / קו / סוף אות / סוף מילה]** – להשוואה עם האות שהתקבל

חידה – רק מצפצפים ומהבהבים, והמאזינים מפענחים בעצמם:
```blocks
israel.setMorseRadioGroup(7)
israel.onMorseReceived(function (signal) {
    israel.showMorseSignal(signal)
    israel.playMorseSignal(signal)
})
```

**4. בונים מפענח** – אוספים את הנקודות והקווים במשתנה, ובסוף כל אות משווים ל"קוד מורס של" כל אות:
```blocks
let code = ""
let letters = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת"]
israel.setMorseRadioGroup(7)
israel.onMorseReceived(function (signal) {
    israel.playMorseSignal(signal)
    if (signal == israel.morseSignal(MorseSignal.Dot) || signal == israel.morseSignal(MorseSignal.Dash)) {
        code = "" + code + signal
    } else if (signal == israel.morseSignal(MorseSignal.LetterEnd)) {
        for (let letter of letters) {
            if (israel.textToMorse(letter) == code) {
                israel.showHebrew(letter)
            }
        }
        code = ""
    }
})
```

> האירוע "כשמתקבל אות מורס" משתמש באירוע הרדיו "כשמתקבל ערך", ולכן אין להשתמש באירוע הזה במקום אחר באותה תוכנית.

### כיף
```blocks
basic.showNumber(israel.israelAge(2026))
```
מחזיר את גיל מדינת ישראל בשנה שבוחרים.

## דוגמה: יום העצמאות
```blocks
input.onButtonPressed(Button.A, function () {
    israel.showSymbol(IsraelSymbol.StarOfDavid)
    israel.playHatikvah()
})
input.onButtonPressed(Button.B, function () {
    israel.playAnimation(IsraelAnimation.Fireworks)
    israel.showGreeting(HebrewGreeting.HappyIndependenceDay)
})
```

## הערה על צבעים
הבלוקים צבועים בכחול של דגל ישראל. הלדים של המיקרוביט עצמו אדומים.

---

## English

MakeCode extension for the BBC micro:bit with Israeli blocks: the Star of David and other symbols,
a built-in 5×5 Hebrew font for scrolling Hebrew text right-to-left, ready-made Hebrew greetings,
Hatikvah and Israeli holiday songs, Star of David and fireworks animations, Hanukkah candle lighting,
and Hebrew Morse code: an encoder, a radio Morse puzzle and building blocks for your own telegraph.

Add it in MakeCode via **Extensions** and the URL `https://github.com/nadaval56/israel-microbit`.
Block names are translated to Hebrew when the editor language is set to Hebrew.

## License

MIT

## Supported targets

* for PXT/microbit

<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
