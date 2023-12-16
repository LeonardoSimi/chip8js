class Renderer {

    constructor(scale){
        this.horizontalPixel = 64;
        this.verticalPixels = 32;

        this.scale = scale;
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.height = this.verticalPixels * this.scale;
        this.canvas.width = this.horizontalPixel * this.scale;

        this.display = new Array(this.horizontalPixel * this.verticalPixels);
    }

    //TURNING PIXELS ON AND OFF
    setPixel(x, y) {

        if (x > this.horizontalPixel) {
            x -= this.horizontalPixel;
        }
        else if (x < 0) {
            x += this.horizontalPixel;
        }

        if (y > this.verticalPixels){
            y -= this.verticalPixels;
        }
        else if (y < 0) {
            y += this.verticalPixels;
        }

        let pixelPosition = x + (y * this.horizontalPixel);

        console.log('x= '+x + ' y= ' +y);

        this.display[pixelPosition] ^= 1; //toggle pixel to 0 or 1
                                          //if 0 pixel gets erased

        console.log('setPixel func');
        return !this.display[pixelPosition]; //value to see if pixel was erased
    }

    clear(){
        //INITIALIZE DISPLAY CLEAN
        this.display = new Array(this.horizontalPixel * this.verticalPixels);
    }

    //RENDERS DISPLAY ARRAY
    render() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

        for (let i =0; i < this.horizontalPixel * this.verticalPixels; i++){
            let x = (i % this.horizontalPixel) * this.scale; //get horizontal pos
            let y = Math.floor (i / this.horizontalPixel) * this.scale; //get vertical pos

            //for every this.display[i]==1 draw a pixel
            if (this.display[i]){
                this.ctx.fillStyle = '#000';

                //set pixel in correct position
                this.ctx.fillRect(x,y, this.scale, this.scale);
            }
        }
    }

    /*testRender(){
        console.log("started test render");
        this.setPixel(0,0);
        this.setPixel(5,2);
        this.setPixel(10,3);
        this.setPixel(7,20);
        this.setPixel(30,30);
        this.setPixel(1,1);
    }*/

}


export default Renderer;