class Sound{
    constructor(){
        const AudioContext = window.AudioContext;

        this.audioCtx = new AudioContext;
        this.gain = this.audioCtx.createGain();
        this.finish = this.audioCtx.destination;

        //connect the gain to the cxt
        this.gain.connect(this.finish);
    }

    play(frequency){
        if (this.audioCtx && !this.oscillator) {
            this.oscillator = this.audioCtx.createOscillator();

            this.oscillator.frequency.setValueAtTime(frequency || 440, this.audioCtx);
            this.oscillator.type = 'square';

            this.oscillator.connect(this.gain);
            this.oscillator.start();
        }
    }

    stop(){
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.oscillator = null;
        }
    }
}

export default Sound;