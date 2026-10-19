// tests go here; this will not be compiled when this package is used as an extension.
israel.showSymbol(IsraelSymbol.StarOfDavid)
israel.playAnimation(IsraelAnimation.Fireworks)
israel.lightHanukkiah(8)
israel.showHebrew("שלום 2026!")
israel.showGreeting(HebrewGreeting.AmIsraelChai)
basic.showNumber(israel.israelAge(2026))
input.onButtonPressed(Button.A, function () {
    israel.playHatikvah()
})
input.onButtonPressed(Button.B, function () {
    israel.playSong(IsraeliSong.Sevivon)
})
input.onButtonPressed(Button.AB, function () {
    israel.playSong(IsraeliSong.AmYisraelChai)
})
israel.showSymbol(IsraelSymbol.Dreidel)
israel.playSong(IsraeliSong.Salenu)
