// tests go here; this will not be compiled when this package is used as an extension.
israel.showSymbol(IsraelSymbol.StarOfDavid)
israel.showHebrew("שלום 2026!")
israel.scrollPicture(IsraelPicture.Flag)
israel.scrollHanukkiah(3)
input.onButtonPressed(Button.A, function () {
    israel.playHatikvah()
})
input.onButtonPressed(Button.B, function () {
    israel.playSong(IsraeliSong.Sevivon, 150)
})
israel.setMorseRadioGroup(7)
israel.setMorseSpeed(100)
israel.playMorse("שלום")
basic.showString(israel.textToMorse("SOS"))
israel.sendMorse("חג שמח")
israel.receiveMorse()
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    israel.sendDot()
    israel.sendDash()
    israel.endLetter()
    israel.showHebrew(israel.lastLetterSent())
    israel.endWord()
})
