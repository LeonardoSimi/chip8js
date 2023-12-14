import Renderer from './renderer.js';
import Keys from './keys.js';
import Sound from './sound.js';

const renderer = new Renderer(10);
const keys = new Keys();
const sound = new Sound();

let loop;
let hz = 60, frameInterval, startTime, now, then, elapsed;

function init() {
    frameInterval = 1000/hz;
    then = Date.now();
    startTime = then;

    //TEST
    
    renderer.testRender();
    renderer.render();
    
    //END TEST
}

function step() {
    now = Date.now();
    elapsed = now - then;

    if (elapsed > frameInterval) {
        //cpu cycle
    }

    loop = requestAnimationFrame(step);
}

init();