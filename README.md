# 🇮🇱 ישראל – בלוקים ישראליים למיקרוביט

הרחבה ל-[MakeCode](https://makecode.microbit.org) עם בלוקים בכחול-לבן: דגל ישראל, מגן דוד, סמלי המדינה,
טקסט בעברית על מסך הלדים, ניגון "התקווה" ואנימציות לחגים.

## איך מוסיפים את ההרחבה

1. פתחו פרויקט ב-https://makecode.microbit.org
2. לחצו על ⚙️ ← **הרחבות** (Extensions)
3. הדביקו את הכתובת **https://github.com/nadaval56/israel-microbit** בשורת החיפוש ובחרו בהרחבה
4. בארגז הכלים תופיע קטגוריה כחולה חדשה בשם **ישראל** (Israel)

> כשממשק MakeCode מוגדר לעברית, שמות הבלוקים מופיעים בעברית. בממשק באנגלית הם מופיעים באנגלית.

## הבלוקים

### סמלים
```blocks
israel.showFlag()
israel.showSymbol(IsraelSymbol.StarOfDavid)
```
סמלים זמינים: דגל ישראל, מגן דוד, מנורה, חנוכייה, רימון, סביבון, ספר תורה.
הסמלים משתמשים בעוצמות אור שונות: הצורה עצמה בהירה, ופרטי רקע (כמו פסי הדגל) עמומים יותר.
הבלוק `תמונה של` מחזיר את הסמל כתמונה, לשימוש עם בלוקי התמונות של MakeCode.

### אנימציות
```blocks
israel.playAnimation(IsraelAnimation.FlagRaising)
israel.playAnimation(IsraelAnimation.WavingFlag)
israel.playAnimation(IsraelAnimation.StarOfDavid)
israel.playAnimation(IsraelAnimation.Fireworks)
israel.lightHanukkiah(3)
```
* **דגל מתנופף** – גל של אור עובר על הדגל
* **הנפת הדגל** – הדגל עולה מלמטה ומתנופף
* **מגן דוד** – שני המשולשים מתחלפים ואז הכוכב פועם
* **זיקוקי יום העצמאות** – זיקוקים שמתפוצצים ונגמרים בדגל
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
    israel.showFlag()
    israel.playHatikvah()
})
input.onButtonPressed(Button.B, function () {
    israel.showSymbol(IsraelSymbol.StarOfDavid)
    israel.playAmYisraelChai()
})
```
* **נגן את התקווה** – פתיחת ההמנון ("כל עוד בלבב פנימה...")
* **נגן עם ישראל חי** – השיר של שלמה קרליבך, שני החלקים עם החזרות

המנגינות מתנגנות ברמקול של המיקרוביט, או ברמקול שמחובר לפין 0. בין התווים יש הפסקה קצרה, כך שתווים זהים ברצף נשמעים בנפרד.
המהירות נקבעת לפי בלוק "קבע קצב" (tempo) של MakeCode.

### כיף
```blocks
basic.showNumber(israel.israelAge(2026))
```
מחזיר את גיל מדינת ישראל בשנה שבוחרים.

## דוגמה: יום העצמאות
```blocks
input.onButtonPressed(Button.A, function () {
    israel.playAnimation(IsraelAnimation.FlagRaising)
    israel.playHatikvah()
})
input.onButtonPressed(Button.B, function () {
    israel.playAnimation(IsraelAnimation.Fireworks)
    israel.showGreeting(HebrewGreeting.HappyIndependenceDay)
})
```

## הערה על צבעים
הבלוקים צבועים בכחול של דגל ישראל. הלדים של המיקרוביט עצמו אדומים, כך שהדגל על הלוח מוצג בצורה ולא בצבע.

---

## English

MakeCode extension for the BBC micro:bit with Israeli blocks: the Israeli flag, the Star of David and other
national symbols, a built-in 5×5 Hebrew font for scrolling Hebrew text right-to-left, ready-made Hebrew
greetings, the opening of Hatikvah, flag and fireworks animations, and Hanukkah candle lighting.

Add it in MakeCode via **Extensions** and the URL `https://github.com/nadaval56/israel-microbit`.
Block names are translated to Hebrew when the editor language is set to Hebrew.

## License

MIT

## Supported targets

* for PXT/microbit

<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
