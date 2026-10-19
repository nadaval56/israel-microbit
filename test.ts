// tests go here; this will not be compiled when this package is used as an extension.
israel.showSymbol(IsraelSymbol.StarOfDavid)
israel.showHebrew("שלום 2026!")
israel.scrollPicture(IsraelPicture.Flag)
israel.scrollHanukkiah(3)
input.onButtonPressed(Button.A, function () {
    israel.playHatikvah()
})
input.onButtonPressed(Button.B, function () {
    israel.playSong(IsraeliSong.Sevivon)
})
israel.setMorseRadioGroup(7)
israel.setMorseSpeed(100)
israel.playMorse("שלום")
israel.showHebrew(israel.morseToText(israel.textToMorse("עם ישראל חי")))
israel.sendMorse("חג שמח")
israel.startTelegraph()
