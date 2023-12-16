import Renderer from './renderer.js';
import Keys from './keys.js';
import Sound from './sound.js';
import CPU from './cpu.js'

const renderer = new Renderer(10);
const keys = new Keys();
const sound = new Sound();
const cpu = new CPU(renderer, keys, sound);

let loop;
let hz = 60, frameInterval, startTime, now, then, elapsed;

function init() {
    frameInterval = 1000 / hz;
    then = Date.now();
    startTime = then;

    cpu.loadSpritesInMemory();
    //console.log('loaded sprites in memory');
    cpu.loadRom('BLINKY1');
    //console.log('loaded rom');
    loop = requestAnimationFrame(step);

    //TEST
    
    //renderer.testRender();
    //renderer.render();
    
    //END TEST
}

function step() {
    now = Date.now();
    elapsed = now - then;

    if (elapsed > frameInterval) {
        cpu.cycle();
    }

    loop = requestAnimationFrame(step);
}

init();