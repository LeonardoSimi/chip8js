class Renderer {

    constructor(scale){
        this.verticalPixels = 64;
        this.horizontalPixel = 32;

        this.scale = scale;
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.height = this.verticalPixels * this.scale;
        this.canvas.width = this.horizontalPixel * this.scale;

        this.display = new Array(this.verticalPixels * this.horizontalPixel);
    }

    //TURNING PIXELS ON AND OFF
    setPixel(x, y) {

        if (x > this.verticalPixels) {
            x -= this.verticalPixels;
        }
        else if (x < 0) {
            x += this.verticalPixels;
        }

        if (y > this.horizontalPixel){
            y -= this.horizontalPixel;
        }
        else if (y < 0) {
            y += this.horizontalPixel;
        }

        let pixelPosition = x + (y * this.verticalPixels);

        this.display[pixelPosition] ^= 1; //toggle pixel to 0 or 1
                                          //if 0 pixel gets erased
        return !this.display[pixelPosition]; //value to see if pixel was erased
    }

    clear(){
        //INITIALIZE DISPLAY CLEAN
        this.display = new Array(this.verticalPixels * this.horizontalPixel);
    }

    //RENDERS DISPLAY ARRAY
    render() {

    }


}

export default Renderer;