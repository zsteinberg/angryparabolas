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

        const numHorizontalSquares = Math.floor(this.parent.width/ this.squareWidth)
        const numVerticalSquares = Math.floor(this.parent.height/ this.squareWidth)


        //vertical lines
        for(var x=startPos[0] % this.squareWidth; x <= this.parent.width; x+= this.squareWidth){
            context.moveTo(x, 0);
            context.lineTo(x, this.parent.height);
        }

        //horizontal lines
        for(var y=startPos[1] % this.squareWidth; y <= this.parent.height; y+= this.squareWidth){
            context.moveTo(0, y);
            context.lineTo(this.parent.width, y);
        }
        context.stroke();

        //thick x-axis
        context.strokeStyle = "#BECFEE";
        context.beginPath();
        context.moveTo(0, startPos[1]);
        context.lineTo(this.parent.width, startPos[1]);
        context.stroke();
    }
    pixelToCoordSystem(x,y){
        let startPos = this.parent.launcherPos;
        return [(x-startPos[0])/this.squareWidth, -(y-startPos[1])/this.squareWidth];
    }
}
