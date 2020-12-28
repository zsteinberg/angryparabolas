import GameObject from './GameObject.js';
import { dist, drawCircle, vecSub, vecScale, drawTriangleInDirection } from './helperfuncs.js';

export default class DraggableBird extends GameObject{
    /*
    */
    constructor(parent, freq, hasHalo=false){
        super();
        this.pos = [parent.centerPos[0],parent.centerPos[1]];
        this.parent = parent;

        this.defaultRadius = 25;
        this.hoverRadius = 27;
        this.currentRadius = this.defaultRadius;

        this.mode = "ready";
        this.dragging = false;
        this.dragPos = [0,0];

        this.velocity = [0,0];

        this.gravity = 300;

        this.historyPoints = [];
    }

    update(dt){

        if(this.mode == "flight"){


            this.pos[0] += this.velocity[0] * dt;
            this.pos[1] += this.velocity[1] * dt;

            this.velocity[1] += this.gravity * dt;
        
            //save position for parabola
            this.historyPoints.push([...this.pos]);

            if(this.pos[1] > this.parent.height){
                this.pos = [this.parent.centerPos[0],this.parent.centerPos[1]];
                this.mode = "ready";
                this.velocity = [0,0];
            }

        }

    }

    draw(context){

        if(this.mode == "ready"){
            this.pos = [this.parent.centerPos[0],this.parent.centerPos[1]];
        }

        

        if(this.mode == "dragging"){

            //arrow from draggable portion to 
            context.strokeStyle = "#0E1C36";
            context.lineWidth = 4;
            context.beginPath();
            context.moveTo(...this.dragPos);
            context.lineTo(...this.pos);
            context.stroke();
            //dot where you're dragging
            context.fillStyle = "#0E1C36";
            drawCircle(context, this.dragPos[0],this.dragPos[1],10);
  

            //arrow that shows direction of bird
            context.lineWidth = 8;
            let arrowPos = [2*this.pos[0] - this.dragPos[0], 2*this.pos[1] - this.dragPos[1]];
            let triangleEndPos = vecSub(vecScale(this.pos,1.9), vecScale(this.dragPos,0.9));
            context.beginPath();
            context.moveTo(...this.pos);
            context.lineTo(...triangleEndPos);
            context.stroke();
            drawTriangleInDirection(context, triangleEndPos, arrowPos);
        }

        //draw parabola arc
        context.strokeStyle = "#FFA970";
        context.lineWidth = 8;
        context.beginPath();
        if(this.historyPoints.length > 0){
            context.moveTo(...this.historyPoints[0]);
        }
        for(let i=0;i<this.historyPoints.length;i++){
            context.lineTo(...this.historyPoints[i]);
        }
        context.stroke();


            context.fillStyle = "#0E1C36";
        drawCircle(context, this.pos[0],this.pos[1],this.currentRadius);
  
    }

    onmousemove(x,y){
        //test center for hovering
        if(dist([x,y],this.pos) < 30){
            this.isHovered = true;
            this.currentRadius = this.hoverRadius;
        }else{
            this.isHovered = false;
            this.currentRadius = this.defaultRadius;
        }

        if(this.dragging){
            this.dragPos = [x,y];
            this.currentRadius = this.hoverRadius;
        }
    }

    onmousedown(x,y){
        if(dist([x,y],this.pos) < 30 && this.mode == "ready"){
              this.dragging = true;
              this.dragPos = [x,y];
              this.mode = "dragging";
        }
    }
    beginFlight(){
        this.velocity = vecScale(vecSub(this.pos,this.dragPos),1);
        this.mode = "flight";
        this.historyPoints = [];
    }
    onmouseup(x,y){
        this.dragging = false;
        if(this.mode == "dragging"){
            this.beginFlight();
        }
    }
}
