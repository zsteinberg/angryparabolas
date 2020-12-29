import GameObject from './GameObject.js';
import { vecAdd, drawCircle } from './helperfuncs.js';

export default class CoordText extends GameObject{
    /*
    */
    constructor(parent, pos, offset=[0,-20]){
        super();
        this.parent = parent;
        this.pos = pos;
        this.offset = offset;
    }

    draw(context){

        context.font = "24px Helvetica";
        context.fillStyle = "#0E1C36";

        let coords = this.parent.coordinateSystem.pixelToCoordSystem(...this.pos);

        let text = '(' + coords[0].toFixed(1) + ',' + coords[1].toFixed(1) + ')';
        let textCenter = [this.pos[0] - context.measureText(text).width/2, this.pos[1]];
        let textPos = vecAdd(this.offset, textCenter);
        context.fillText(text, ...textPos);
        
        drawCircle(context, this.pos[0], this.pos[1], 10);
    }
    roundToTwoDecimalPlaces(n){
        return Math.round(n*10)/10;
    }
}
