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
        console.log('initialized loading sprites in memory');
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
        console.log('finished loading sprites in memory');
    }

    loadProgramInMemory(program) {
        for (let loc = 0; loc < program.length; loc++) {
            this.memory[0x200 + loc] = program[loc];
        }
    }

    loadRom(romName) {
        console.log('initialized rom loading');
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
        console.log('loaded rom: ' + romName);
    }

    //exectues instructions, manage sound, timers and rendering
    cycle() {
        for (let i = 0; i < this.speed; i++) {
            if (!this.paused) {
                let opcode = (this.memory[this.pc] << 8 | this.pc + 1); /*16 bit opcodes made by 2 8bit pieces
                                                                          adding hex 0x00 to the right side of a 1 byte value
                                                                          ex. 0x10 into 0x10F0*/
                this.executeInstruction(opcode);

            }
        }
        if (!this.paused) {
            this.updateTimers();
        }

        this.playSound();
        this.renderer.render();
    }

    //timers -1 at 60hz rate
    //setting its value and reading its value
    updateTimers() {
        if (this.delayTimer > 0) {
            this.delayTimer -= 1;
        }

        if (this.soundTimer > 0) {
            this.soundTimer -= 1;
        }
    }

    playSound() {

        if (this.soundTimer > 0) {
            this.sound.play(440);
        }

        else {
            this.sound.stop();
        }
    }

    executeInstruction(opcode) {
        //counter for next instruction, 2 byte long
        this.pc += 2;

        /*      docs: http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#3.0
           nnn or addr - A 12-bit value, the lowest 12 bits of the instruction
           n or nibble - A 4-bit value, the lowest 4 bits of the instruction
           x - A 4-bit value, the lower 4 bits of the high byte of the instruction
           y - A 4-bit value, the upper 4 bits of the low byte of the instruction
           kk or byte - An 8-bit value, the lowest 8 bits of the instruction */

        let x = (opcode & 0x0F00) >> 8;
        let y = (opcode & 0x00F0) >> 4;

        switch (opcode & 0xF000) {
            case 0x0000:
                switch (opcode) {
                    case 0x00E0:
                        this.renderer.clear(); //clear display
                        break;
                    case 0x00EE:
                        this.pc = this.stack.pop(); //set pc to the address at the top of the stack and subtract 1 from the stack array
                        break;
                }
                break;

            case 0x1000:
                this.pc = (opcode & 0xFFF); //set pc to the nnn value
                break;

            case 0x2000:
                this.stack.push(this.pc);
                this.pc = (opcode & 0xFFF); //set pc to the nnn value
                break;

            case 0x3000:
                if (this.v[x] === (opcode & 0xFF)) { 
                    this.pc += 2; //skip next instruction
                }
                break;

            case 0x4000:
                if (this.v[x] !== (opcode & 0xFF)) { 
                    this.pc += 2; //skip next instruction
                }
                break;

            case 0x5000:
                if (this.v[x] === this.v[y]) { 
                    this.pc += 2; //skip next instruction
                }
                break;

            case 0x6000:
                this.v[x] = (opcode & 0xFF);
                break;

            case 0x7000:
                this.v[x] += (opcode & 0xFF);
                break;

            case 0x8000: 
                switch (opcode & 0xF) { //all instructions end with a value between 0-7 or E, it grabs the last part

                    case 0x0:
                        this.v[x] = this.v[y];
                        break;

                    case 0x1:
                        this.v[x] |= this.v[y];
                        break;

                    case 0x2:
                        this.v[x] &= this.v[y];
                        break;

                    case 0x3:
                        this.v[x] ^= this.v[y];
                        break;

                    case 0x4:
                        let sum = (this.v[x] += this.v[y]);

                        this.v[0xF] = 0;

                        if (sum > 0xFF) {
                            this.v[0xF] = 1;
                        }

                        this.v[x] = sum;
                        break;

                    case 0x5:
                        this.v[0xF] = 0;

                        if (this.v[x] > this.v[y]) {
                            this.v[0xF] = 1;
                        }

                        this.v[x] -= this.v[y];
                        break;

                    case 0x6:
                        this.v[0xF] = (this.v[x] & 0x1);

                        this.v[x] >>= 1;
                        break;

                    case 0x7:
                        this.v[0xF] = 0;

                        if (this.v[y] > this.v[x]) {
                            this.v[0xF] = 1;
                        }

                        this.v[x] = this.v[y] - this.v[x];
                        break;
                        
                    case 0xE:
                        this.v[0xF] = this.v[x] & 0x80;
                        this.v[x] <<= 1;
                        break;
                }
                break;

            case 0x9000:
                if (this.v[x] !== this.v[y]) {
                    this.pc += 2;
                }
                break;

            case 0xA000:
                this.i = (opcode & 0xFFF);
                break;

            case 0xB000:
                this.pc = (opcode & 0xFFF) + this.v[0];
                break;

            case 0xC000:
                let random = Math.floor(Math.random() * 0xFF);
                this.v[x] = random & (opcode & 0xFF);
                break;

            case 0xD000: //drawing and erasing pixels
                let width = 8;
                let height = (opcode & 0xF);

                this.v[0xF] = 0;
                
                for (let row = 0; row < height; row++) {
                    let sprite = this.memory[this.i + row];

                    for (let col = 0; col < width; col++) {
                        if ((sprite & 0x80) > 0) {
                            if (this.renderer.setPixel(this.v[x] + col, this.v[y] + row)) {
                                this.v[0xF] = 1;
                            }
                        }
                        sprite <<= 1;
                    }
                }
                break;

            case 0xE000:
                switch (opcode & 0xFF) {

                    case 0x9E:
                        if (this.keys.pressedKeys(this.v[x])) {
                            this.pc += 2;
                        }
                        break;

                    case 0xA1:
                        if (!this.keys.pressedKeys(this.v[x])) {
                            this.pc += 2;
                        }
                        break;
                }
        
                break;
            case 0xF000:
                switch (opcode & 0xFF) {

                    case 0x07:
                        this.v[x] = this.delayTimer;
                        break;

                    case 0x0A:
                        this.paused = true;
                        
                        this.keys.onNextKeyPress = function(key) {
                            this.v[x] = key;
                            this.paused = false;
                        }.bind(this);
                        break;

                    case 0x15:
                        this.delayTimer = this.v[x];
                        break;

                    case 0x18:
                        this.soundTimer = this.v[x];
                        break;

                    case 0x1E:
                        this.i += this.v[x];
                        break;

                    case 0x29:
                        this.i = this.v[x] * 5; //set i to the location of the sprite at v[x] which is 5 bytes long
                        break;

                    case 0x33:
                        this.memory[this.i] = parseInt(this.v[x]/100);

                        this.memory[this.i + 1] = parseInt((this.v[x] % 100) /10);

                        this.memory[this.i + 2] = parseInt(this.v[x] % 10);
                        break;
                        
                    case 0x55:
                        for (let reg = 0; reg <= x; reg++) {
                            this.memory[this.i + reg] = this.v[reg];
                        }
                        break;

                    case 0x65:
                        for (let reg = 0; reg <= x; reg++) {
                            this.v[reg] = this.memory[this.i + reg];
                        }
                        break;
                }
        
                break;
        
            default:
                throw new Error('Unknown opcode ' + opcode);
        }

    }
}

export default CPU;