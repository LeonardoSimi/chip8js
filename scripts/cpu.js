class CPU {
    constructor(renderer, keys, sound) {
        this.renderer = renderer;
        this.keys = keys;
        this.sound = sound;

        this.memory = new Uint8Array(4096); //4kb
        this.v = new Uint8Array(16); //16 8-bit registers

        this.i = 0; //memory address pointer

        this.delayTimer = 0;
        this.soundTimer = 0;

        this.pc = 0x200; //program counter

        this.stack = new Array();

        this.paused = false;

        this.speed = 10;
    }

    loadSpritesInMemory() {
        //hex values for each sprite
        const sprites = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ];

        //loading sprites in memory starting at 0x000
        for (let i = 0; i < sprites.length; i++) {
            this.memory[i] = sprites[i];
        }
    }

    loadProgramInMemory(program) {
        for (let loc = 0; loc < program.length; loc++) {
            this.memory[0x200 + loc] = program[loc];
        }
    }

    loadRom(romName) {
        var request = new XMLHttpRequest;
        var self = this;

        request.onload = function() {
            if (request.response) {
                let program = new Uint8Array(request.response);

                self.loadProgramInMemory(program);
            }
        }

        request.open('GET', 'roms/' + romName);
        request.responseType = 'arraybuffer';

        request.send();
    }

    cycle() {

    }
}

export default CPU;