// tests go here; this will not be compiled when this package is used as an extension.
israel.showFlag()
israel.showSymbol(IsraelSymbol.StarOfDavid)
israel.playAnimation(IsraelAnimation.FlagRaising)
israel.lightHanukkiah(8)
israel.showHebrew("שלום 2026!")
israel.showGreeting(HebrewGreeting.AmIsraelChai)
basic.showNumber(israel.israelAge(2026))
input.onButtonPressed(Button.A, function () {
    israel.playHatikvah()
})
