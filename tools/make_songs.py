"""
Generates songs.ts from the readable melodies below.

Each melody is a list of "note:length" tokens. A note is a letter, an optional
"s" (sharp) or "b" (flat) and an octave; "R" is a rest. Lengths are in sixteenth
notes (4 = a quarter note). The generated code stores every note in two
characters so that the songs fit on a micro:bit V1.

Run from the repository root:  python3 tools/make_songs.py
"""

# (enum name, block text or None for Hatikvah, tempo in quarter notes per minute,
#  octaves to raise, lyrics, source, melody)
SONGS = [
    ("Hatikvah", None, 72, 0,
        "Kol od ba-le-vav pe-ni-ma ... e-retz tzi-yon vi-ru-sha-la-yim",
        "FluteTunes score",
        "D5:2 E5:2 F5:2 G5:2 A5:4 A5:4 As5:2 A5:2 As5:2 D6:2 A5:8 G5:4 G5:2 G5:2 F5:4 F5:4 E5:2 D5:2 "
        "E5:2 F5:2 D5:6 A4:2 D5:2 E5:2 F5:2 G5:2 A5:4 A5:4 As5:2 A5:2 As5:2 D6:2 A5:8 G5:4 G5:2 G5:2 "
        "F5:4 F5:4 E5:2 D5:2 E5:2 F5:2 D5:8 D5:4 D6:4 D6:4 D6:4 C6:2 D6:2 C6:2 As5:2 A5:8 D5:4 D6:4 D6:4 "
        "D6:4 C6:2 D6:2 C6:2 As5:2 A5:8 G5:4 G5:2 G5:2 F5:4 F5:4 G5:2 A5:2 As5:2 C6:2 A5:4 G5:2 F5:2 "
        "G5:4 G5:4 F5:4 F5:4 E5:2 D5:2 E5:2 F5:2 D5:8 G5:4 G5:2 G5:2 F5:4 F5:4 G5:2 A5:2 As5:2 C6:2 A5:4 "
        "G5:2 F5:2 G5:4 G5:4 F5:4 F5:4 E5:2 D5:2 E5:2 F5:2 D5:8 "),
    ("AmYisraelChai", 'Am Yisrael Chai', 120, 0,
        "Am Yis-ra-el chai, od a-vi-nu chai (Shlomo Carlebach)",
        "jewisheetmusic.com note-name score",
        "A4:2 A4:2 G4:2 E4:2 A4:8 A4:2 A4:2 G4:2 E4:2 A4:8 C5:2 C5:2 B4:2 A4:2 C5:2 C5:2 B4:2 A4:2 D5:2 "
        "D5:2 B4:2 G4:2 A4:8 A4:2 A4:2 G4:2 E4:2 A4:8 A4:2 A4:2 G4:2 E4:2 A4:8 C5:2 C5:2 B4:2 A4:2 C5:2 "
        "C5:2 B4:2 A4:2 D5:2 D5:2 B4:2 G4:2 A4:4 R:4 E5:2 E5:2 E5:2 E5:2 E5:2 E5:2 E5:2 E5:2 D5:2 E5:2 "
        "D5:2 B4:2 G4:8 D5:2 D5:2 D5:2 D5:2 D5:2 D5:2 D5:2 D5:2 E5:2 D5:2 C5:2 B4:2 A4:4 R:4 E5:2 E5:2 "
        "E5:2 E5:2 E5:2 E5:2 E5:2 E5:2 D5:2 E5:2 D5:2 B4:2 G4:8 D5:2 D5:2 D5:2 D5:2 D5:2 D5:2 D5:2 D5:2 "
        "E5:2 D5:2 C5:2 B4:2 A4:8 "),
    ("Sevivon", 'Sevivon (Hanukkah)', 84, 0,
        "Se-vi-von, sov sov sov, Cha-nu-ka hu chag tov",
        "FluteTunes score",
        "D5:2 D5:2 E5:4 F5:2 F5:2 E5:4 A5:2 A5:2 G5:1 F5:1 E5:1 D5:1 F5:2 F5:2 E5:4 D5:2 D5:2 E5:4 F5:2 "
        "F5:2 G5:4 A5:2 A5:2 A5:2 A4:2 D5:2 D5:2 D5:4 G5:2 G5:2 G5:2 As5:2 A5:2 A5:2 F5:1 E5:1 D5:2 Cs5:2 "
        "Cs5:2 A4:2 Cs5:2 D5:3 E5:1 F5:1 E5:1 D5:2 G5:2 G5:2 G5:2 As5:2 A5:4 F5:1 E5:1 D5:2 Cs5:2 Cs5:2 "
        "A4:2 Cs5:2 D5:2 D5:2 D5:4 "),
    ("MaozTzur", 'Maoz Tzur (Hanukkah)', 92, 1,
        "Ma-oz tzur ye-shu-a-ti (traditional melody)",
        "Zemereshet score",
        "F4:4 C4:4 F4:4 As4:4 A4:4 G4:4 F4:4 R:4 C5:4 D5:4 G4:4 A4:2 As4:2 A4:4 G4:4 F4:4 R:4 F4:4 C4:4 "
        "F4:4 As4:4 A4:4 G4:4 F4:4 R:4 C5:4 D5:4 G4:4 A4:2 As4:2 A4:4 G4:4 F4:4 R:2 C5:2 C5:6 C5:2 D5:4 "
        "E5:4 F5:8 C5:8 F5:4 E5:4 D5:4 C5:4 C5:2 As4:2 A4:2 As4:2 G4:4 R:4 A4:6 As4:2 C5:4 R:2 C5:2 G4:6 "
        "A4:2 As4:4 R:4 A4:4 F4:4 D5:4 C5:2 As4:2 A4:4 As4:4 C5:4 R:4 A4:6 As4:2 C5:4 R:2 C5:2 G4:6 A4:2 "
        "As4:4 R:4 A4:4 F4:4 D5:4 C5:2 As4:2 A4:4 G4:4 F4:8 "),
    ("ChagPurim", 'Chag Purim (Purim)', 100, 0,
        "Chag Pu-rim, chag Pu-rim, chag ga-dol hu la-ye-hu-dim",
        "UCI MIDI performance",
        "F5:2 G5:2 F5:4 F5:2 G5:2 F5:4 F5:2 G5:2 F5:2 G5:2 F5:2 E5:2 D5:4 D5:2 G5:2 G5:4 D5:2 G5:2 G5:4 "
        "D5:2 G5:2 F5:2 E5:2 F5:8 A5:2 A5:1 A5:1 G5:2 F5:2 G5:2 G5:2 G5:4 G5:2 G5:1 G5:1 F5:2 D5:2 F5:2 "
        "F5:2 F5:4 A5:2 A5:1 A5:1 G5:2 F5:2 G5:2 G5:2 G5:4 D5:2 G5:2 F5:2 E5:2 D5:8 "),
    ("Dayenu", 'Dayenu (Passover)', 100, 0,
        "I-lu ho-tzi-a-nu mi-mitz-ra-yim, da-ye-nu",
        "FluteTunes score",
        "B4:2 D5:2 D5:2 D5:2 D5:2 E5:2 D5:2 C5:2 B4:2 D5:2 D5:2 D5:2 D5:2 E5:2 D5:2 C5:2 B4:2 D5:2 A4:2 "
        "C5:2 B4:2 D5:2 A4:2 C5:2 B4:4 A4:4 G4:4 R:4 B4:4 B4:4 D5:2 C5:4 A4:2 C5:4 C5:4 E5:2 D5:4 B4:2 "
        "D5:4 D5:4 G5:2 Fs5:4 Fs5:2 Fs5:2 D5:2 E5:2 Fs5:2 G5:2 D5:2 B4:2 G4:2 B4:4 B4:4 D5:2 C5:4 A4:2 "
        "C5:4 C5:4 E5:2 D5:4 B4:2 D5:4 D5:4 G5:2 Fs5:4 Fs5:2 Fs5:2 D5:2 E5:2 Fs5:2 G5:8 "),
    ("EliEli", 'Eli Eli (Memorial Day)', 84, 1,
        "E-li, E-li, she-lo yi-ga-mer le-o-lam (David Zehavi)",
        "Zemereshet score",
        "B3:4 B4:12 Fs4:4 G4:12 E4:4 G4:4 Fs4:2 E4:2 Ds4:4 E4:2 Fs4:2 B3:12 B3:4 E4:8 E4:4 E4:4 Fs4:12 "
        "E4:2 Fs4:2 G4:8 G4:4 Fs4:2 G4:2 A4:8 A4:4 G4:2 A4:2 B4:8 B4:4 A4:2 B4:2 C5:8 C5:4 C5:4 B4:8 "
        "B4:4 A4:4 B4:12 B4:4 Fs4:8 G4:4 A4:4 G4:12 Fs4:2 E4:2 Ds4:8 E4:4 Fs4:4 E4:8 E4:4 E4:4 C5:8 D5:4 "
        "C5:4 B4:8 A4:4 G4:4 Fs4:8 G4:4 Fs4:4 E4:12 "),
    ("Vesamachta", 'Vesamachta Bechagecha (Sukkot)', 160, 1,
        "Ve-sa-mach-ta be-cha-ge-cha, ve-ha-yi-ta ach sa-me-ach (D Hijaz, two passes)",
        "transcription from the user's earlier Claude Code session",
        "Fs4:4 G4:4 A4:4 As4:4 C5:2 As4:4 A4:2 A4:2 G4:2 G4:2 Fs4:2 A4:2 G4:2 G4:2 Fs4:2 Fs4:2 Ds4:2 "
        "Ds4:2 D4:2 Fs4:12 R:4 "
        "Fs4:4 G4:4 A4:4 As4:4 C5:2 As4:4 A4:2 A4:2 G4:2 G4:2 Fs4:2 A4:2 G4:2 G4:2 Fs4:2 Fs4:2 Ds4:2 "
        "Ds4:2 D4:2 D4:12 R:4 "),
    ("UshavtemMayim", 'Ushavtem Mayim (Sukkot)', 100, 0,
        "U-sh'-av-tem ma-yim be-sa-son (Emanuel Amiran)",
        "Zemereshet score and UCI MIDI",
        "D5:1 D5:1 D5:2 E5:2 F5:1 E5:1 D5:2 F5:2 G5:2 A5:3 G5:1 F5:2 A5:2 C6:2 As5:2 A5:2 G5:2 A5:2 D5:1 "
        "D5:1 D5:2 E5:2 F5:1 E5:1 D5:2 F5:2 G5:2 A5:4 D6:2 D6:2 C6:2 C6:2 A5:2 C6:2 D6:4 D6:2 D6:2 D6:2 "
        "D6:2 D6:2 D6:2 D6:2 D6:2 R:2 D6:2 C6:2 C6:2 A5:2 C6:2 D6:4 D6:2 D6:2 D6:2 D6:2 D6:2 D6:2 D6:2 "
        "D6:2 R:2 D6:2 C6:2 C6:2 A5:2 G5:2 A5:4 C6:4 C6:4 C6:4 C6:4 C6:2 C6:2 As5:1 A5:1 G5:2 C6:2 C6:2 "
        "As5:1 A5:1 G5:2 F5:2 G5:2 A5:1 As5:1 A5:2 G5:2 F5:2 C6:4 C6:2 C6:2 As5:1 A5:1 G5:2 C6:2 C6:2 "
        "As5:1 A5:1 G5:2 A5:2 A5:2 F5:1 E5:1 D5:2 F5:2 E5:2 D5:4 "),
    ("BarYochai", 'Bar Yochai (Lag BaOmer)', 108, 1,
        "Bar Yo-chai, nim-shach-ta ash-re-cha",
        "playjewishmusic.com lead sheet",
        "F4:6 G4:2 F4:6 D4:2 G4:4 G4:2 G4:2 F4:2 E4:2 D4:4 R:2 E4:4 G4:2 G4:2 F4:2 F4:4 F4:2 E4:2 D4:2 "
        "E4:2 F4:4 F4:4 F4:6 G4:2 G4:6 G4:2 A4:2 As4:2 A4:2 G4:2 F4:2 E4:2 D4:4 R:2 A4:4 A4:2 A4:4 D4:4 "
        "D4:2 C4:2 B3:2 C4:2 D4:4 D4:4 G4:6 G4:2 F4:2 E4:2 D4:4 G4:2 G4:2 G4:2 G4:2 F4:2 E4:2 D4:4 R:2 "
        "E4:4 G4:2 G4:2 F4:2 F4:4 F4:2 E4:2 D4:2 E4:2 F4:4 F4:4 F4:6 G4:2 G4:6 G4:2 A4:2 As4:2 A4:2 G4:2 "
        "F4:2 E4:2 D4:4 R:2 A4:4 A4:2 A4:4 D4:4 D4:2 C4:2 B3:2 C4:2 D4:4 D4:4 "),
    ("Salenu", 'Salenu Al Ktefenu (Shavuot)', 100, 1,
        "Sa-le-nu al ke-te-fe-nu (Yedidia Admon)",
        "Zemereshet score",
        "C4:2 G4:4 E4:2 F4:2 E4:2 D4:2 C4:2 D4:2 F4:4 E4:2 D4:2 C4:2 E4:4 C4:2 G4:4 E4:2 F4:2 E4:2 D4:2 "
        "C4:2 D4:2 F4:4 E4:2 D4:2 C4:2 C4:4 G4:4 G4:4 G4:8 As4:2 A4:2 G4:2 F4:2 E4:2 F4:2 G4:4 G4:2 R:2 "
        "G4:2 R:2 G4:2 R:2 G4:2 R:2 As4:2 A4:2 G4:2 F4:1 F4:1 E4:2 F4:2 G4:4 C4:2 F4:2 F4:2 F4:2 F4:4 "
        "E4:2 D4:2 C4:2 E4:2 E4:2 E4:2 E4:4 D4:2 C4:2 G4:2 R:2 E4:2 R:2 F4:2 E4:2 D4:4 C4:2 F4:2 E4:2 "
        "D4:2 G4:8 G4:2 R:2 E4:2 R:2 F4:2 E4:2 D4:4 C4:2 F4:2 E4:2 D4:2 C4:8 "),
    ("ShiratHaasavim", 'Shirat HaAsavim', 80, 1,
        "Da le-cha she-kol ro-e ve-ro-e (Naomi Shemer)",
        "Ministry of Education songbook",
        "E4:3 D4:1 D4:6 B3:2 D4:2 E4:2 Fs4:2 E4:1 E4:1 E4:12 G4:2 Fs4:1 G4:1 Fs4:2 E4:1 Fs4:1 E4:6 B3:1 "
        "B3:1 B3:16 E4:3 D4:1 D4:8 D4:2 E4:2 Fs4:2 E4:1 E4:1 Fs4:2 E4:10 G4:2 Fs4:1 G4:1 Fs4:2 E4:1 Fs4:1 "
        "A4:2 D4:4 D4:1 D4:1 B4:10 B4:2 A4:2 G4:2 Fs4:3 E4:1 D4:2 Cs4:2 B3:6 B3:1 B3:1 E4:3 B3:1 E4:10 "
        "B3:1 B3:1 B3:16 E4:2 D4:1 D4:1 D4:6 B3:2 D4:2 E4:2 Fs4:2 E4:1 E4:1 E4:12 G4:2 Fs4:1 G4:1 Fs4:2 "
        "E4:1 Fs4:1 E4:6 B3:1 B3:1 B3:16 E4:3 D4:1 D4:6 B3:2 D4:2 E4:2 Fs4:2 E4:1 E4:1 E4:12 G4:2 Fs4:1 "
        "G4:1 Fs4:2 E4:1 Fs4:1 E4:4 D4:2 D4:2 B4:10 B4:2 A4:2 G4:2 Fs4:3 E4:1 D4:2 Cs4:2 B3:6 B3:1 B3:1 "
        "E4:3 B3:1 E4:10 B3:1 B3:1 B3:16 "),
]

import os
import re

STEPS = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def encode(melody):
    """Two characters per note: the MIDI note number as a character ("!" for a
    rest) and the length in sixteenths as a letter ("a" = 1, "b" = 2, ...)."""
    out = ""
    for token in melody.split():
        m = re.fullmatch(r"(R|([A-G])([sb]?)(\d)):(\d+)", token)
        if not m:
            raise ValueError("bad token " + token)
        length = int(m.group(5))
        if not 1 <= length <= 26:
            raise ValueError("bad length " + token)
        if m.group(1) == "R":
            pitch = "!"
        else:
            midi = 12 * (int(m.group(4)) + 1) + STEPS[m.group(2)]
            midi += {"s": 1, "b": -1, "": 0}[m.group(3)]
            pitch = chr(midi)
            if pitch in '"\\' or not 35 <= midi <= 126:
                raise ValueError("note out of range " + token)
        out += pitch + chr(96 + length)
    return out


def song_call(name, bpm, octave):
    for n, _, b, o, _, _, melody in SONGS:
        if n == name:
            return 'startSong("%s", %d, %d, speed, mode);' % (encode(melody), b, o)
    raise KeyError(name)


def generate():
    names = [s for s in SONGS if s[1] is not None]
    lines = []
    w = lines.append
    w("// Generated by tools/make_songs.py. Edit the melodies there and run it again.")
    w("")
    w("/**")
    w(" * Israeli songs and holiday songs")
    w(" */")
    w("enum IsraeliSong {")
    for i, (name, block, _, _, _, _, _) in enumerate(names):
        w('    //% block="' + block + '"')
        w("    " + name + ("," if i < len(names) - 1 else ""))
    w("}")
    w("")
    w("namespace israel {")
    w("")
    w("    // frequencies of octave 4, from C")
    w("    const octave4 = [262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494];")
    w("")
    w("    // Plays a song stored two characters per note: the MIDI note number (\"!\" = rest)")
    w("    // and the length in sixteenths (\"a\" = 1). The song keeps its own tempo, scaled by")
    w("    // the speed in percent and by the MakeCode tempo block (120 = natural speed), and")
    w("    // can be raised by octaves, which the speaker plays louder. Each note is cut a")
    w("    // little short so that repeated notes are heard separately.")
    w("    // The song stops between notes when another song starts or on \"stop all sounds\".")
    w("    function playNotes(notes: string, bpm: number, octaveUp: number, speed: number, run: number): void {")
    w("        speed = Math.max(10, Math.min(400, speed));")
    w("        const sixteenth = Math.idiv(180000000, bpm * music.tempo() * speed);")
    w("        for (let i = 0; i + 1 < notes.length && run == songRun; i += 2) {")
    w("            const midi = notes.charCodeAt(i);")
    w("            const ms = (notes.charCodeAt(i + 1) - 96) * sixteenth;")
    w("            if (midi == 33) {")
    w("                music.rest(ms);")
    w("            } else {")
    w("                const octave = Math.idiv(midi, 12) - 1 + octaveUp;")
    w("                const f = octave4[midi % 12];")
    w("                const gap = Math.min(60, Math.idiv(ms, 5));")
    w("                music.playTone(octave >= 4 ? f << (octave - 4) : f >> (4 - octave), ms - gap);")
    w("                music.rest(gap);")
    w("            }")
    w("        }")
    w("    }")
    w("")
    w("    // counts the songs started, so that a newer song stops an older one")
    w("    let songRun = 0;")
    w("    let stopHooked = false;")
    w("")
    w("    function startSong(notes: string, bpm: number, octaveUp: number, speed: number, mode: music.PlaybackMode): void {")
    w("        // programs written before the play mode existed pass the speed in its place")
    w("        if (mode > music.PlaybackMode.LoopingInBackground) {")
    w("            speed = mode;")
    w("            mode = music.PlaybackMode.UntilDone;")
    w("        }")
    w("        if (!stopHooked) {")
    w("            stopHooked = true;")
    w("            music._onStopSound(function () { songRun++; });")
    w("        }")
    w("        songRun++;")
    w("        const run = songRun;")
    w("        if (mode == music.PlaybackMode.UntilDone) {")
    w("            playNotes(notes, bpm, octaveUp, speed, run);")
    w("            return;")
    w("        }")
    w("        control.inBackground(function () {")
    w("            do {")
    w("                playNotes(notes, bpm, octaveUp, speed, run);")
    w("            } while (mode == music.PlaybackMode.LoopingInBackground && run == songRun);")
    w("        });")
    w("    }")
    w("")
    hat = [s for s in SONGS if s[0] == "Hatikvah"][0]
    w("    /**")
    w("     * Play Hatikvah, the national anthem of Israel")
    w("     * @param mode play until done, in the background or looping in the background")
    w("     * @param speed speed in percent, 100 is the natural speed, eg: 100")
    w("     */")
    w('    //% blockId=israel_hatikvah block="play Hatikvah %mode||at speed %speed percent"')
    w('    //% mode.defl=music.PlaybackMode.UntilDone')
    w('    //% speed.defl=100 speed.min=25 speed.max=300')
    w('    //% expandableArgumentMode="toggle"')
    w('    //% group="Music" weight=100')
    w("    export function playHatikvah(mode: music.PlaybackMode = music.PlaybackMode.UntilDone, speed: number = 100): void {")
    w("        // " + hat[4] + " (" + hat[5] + ")")
    w("        " + song_call("Hatikvah", hat[2], hat[3]))
    w("    }")
    w("")
    w("    /**")
    w("     * Play an Israeli song or a holiday song")
    w("     * @param song the song to play")
    w("     * @param mode play until done, in the background or looping in the background")
    w("     * @param speed speed in percent, 100 is the natural speed, eg: 100")
    w("     */")
    w('    //% blockId=israel_play_song block="play song %song %mode||at speed %speed percent"')
    w('    //% mode.defl=music.PlaybackMode.UntilDone')
    w('    //% speed.defl=100 speed.min=25 speed.max=300')
    w('    //% expandableArgumentMode="toggle"')
    w('    //% group="Music" weight=90')
    w("    export function playSong(song: IsraeliSong, mode: music.PlaybackMode = music.PlaybackMode.UntilDone, speed: number = 100): void {")
    w("        switch (song) {")
    for name, block, bpm, octave, lyrics, source, _ in names:
        w("            case IsraeliSong." + name + ":")
        w("                // " + lyrics + " (" + source + ")")
        w("                " + song_call(name, bpm, octave))
        w("                break;")
    w("        }")
    w("    }")
    w("")
    w("    /**")
    w('     * Play "Am Yisrael Chai" by Shlomo Carlebach')
    w("     */")
    w('    //% blockId=israel_am_yisrael_chai block="play Am Yisrael Chai"')
    w('    //% group="Music" weight=80 blockHidden=true')
    w("    export function playAmYisraelChai(): void {")
    w("        playSong(IsraeliSong.AmYisraelChai);")
    w("    }")
    w("}")
    w("")
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "songs.ts")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


if __name__ == "__main__":
    generate()
