import GameObject from './GameObject.js';
import { vecAdd, drawCircle } from './helperfuncs.js';

export default class CoordinateSystem extends GameObject{
    /*
    */
    constructor(parent){
        super();
        this.parent = parent;
    }

    draw(context){
        let startPos = this.parent.launcherPos;



        this.squareWidth = Math.min(this.parent.width,this.parent.height)/10;

        context.lineWidth = 4;
        context.strokeStyle = "#ddd";
        context.beginPath();

        const numHorizontalSquares = Math.floor(this.parent.width * 5/8 / this.squareWidth)
        const numVerticalSquares = Math.floor(this.parent.height * 3/4 / this.squareWidth)


        //horizontal lines
        for(var x=0; x <= numHorizontalSquares; x++){
            context.moveTo(x * this.squareWidth + startPos[0], startPos[1] + this.squareWidth * -this.roundedHalf(numVerticalSquares));
            context.lineTo(x * this.squareWidth + startPos[0], startPos[1] + this.squareWidth * this.roundedHalf(numVerticalSquares));
        }

        //vertical lines
        for(var y=-this.roundedHalf(numVerticalSquares); y <= this.roundedHalf(numVerticalSquares); y++){
            context.moveTo(startPos[0], y * this.squareWidth + startPos[1]);
            context.lineTo(startPos[0] + this.squareWidth * numHorizontalSquares, y * this.squareWidth + startPos[1]);
        }
        context.stroke();
    }
    roundedHalf(num){
        if(num % 2 == 1){
            return (num-1)/2;
        }
        return num/2;
    }

    pixelToCoordSystem(x,y){
        let startPos = this.parent.launcherPos;
        return [(x-startPos[0])/this.squareWidth, -(y-startPos[1])/this.squareWidth];
    }
}
