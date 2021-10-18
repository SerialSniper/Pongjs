var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

function playNote(frequency, duration) {
    var oscillator = audioCtx.createOscillator();

    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    oscillator.connect(audioCtx.destination);
    oscillator.start();

    setTimeout(function() {
        oscillator.stop();
        playMelody();
    }, duration);
}