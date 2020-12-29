import GameObject from './GameObject.js';
import CoordText from './CoordText.js';
import { dist, drawCircle, vecAdd, vecSub, vecScale, drawTriangleInDirection } from './helperfuncs.js';

export default class DraggableBird extends GameObject{
    /*
    */
    constructor(parent){
        super();
        this.pos = [...parent.launcherPos];
        this.parent = parent;

        this.defaultRadius = 25;
        this.hoverRadius = 27;
        this.currentRadius = this.defaultRadius;

        this.mode = "ready";
        this.dragging = false;
        this.dragPos = [0,0];

        this.velocity = [0,0];

        this.gravity = 500;

        this.historyPoints = [];
        
        this.resetBird();
    }

    resetBird(){
        this.pos = [...this.parent.launcherPos];
        this.mode = "ready";
        this.velocity = [0,0];
    }

    update(dt){

        if(this.mode == "flight"){

            this.addTextIfNeeded(dt);


            this.pos[0] += this.velocity[0] * dt;
            this.pos[1] += this.velocity[1] * dt;

            this.velocity[1] += this.gravity * dt;
        
            //save position for parabola
            this.historyPoints.push([...this.pos]);

            if(this.pos[1] > this.parent.height){
                this.resetBird();
            }
        }
    }
    addTextIfNeeded(dt){
        //vertex of parabola
        let nextVelocity = this.velocity[1] + this.gravity * dt
        if(this.velocity[1] < 0 && nextVelocity >= 0){
            this.parent.objects.push(new CoordText(this.parent, [...this.pos]));
        }

        //place it crosses the x-axis
        let coords = this.parent.coordinateSystem.pixelToCoordSystem(...this.pos);
        let nextCoords = this.parent.coordinateSystem.pixelToCoordSystem(...vecAdd(this.pos, vecScale(this.velocity,dt)));
        if(coords[1] > 0 && nextCoords[1] <= 0){
            this.parent.objects.push(new CoordText(this.parent, [...this.pos]));
        }
    }

    draw(context){

        if(this.mode == "ready"){
            this.pos = [...this.parent.launcherPos];
        }


        //draw launcher
        context.strokeStyle = "#B86800";
        context.lineWidth = 7;
        context.beginPath();
        context.moveTo(this.parent.launcherPos[0] + 25,this.parent.launcherPos[1] - 10);
        context.lineTo(this.parent.launcherPos[0] + 0,this.parent.launcherPos[1] + 50);
        context.lineTo(this.parent.launcherPos[0] - 25,this.parent.launcherPos[1] - 10);
        context.moveTo(this.parent.launcherPos[0] + 0,this.parent.launcherPos[1] + 50);
        context.lineTo(this.parent.launcherPos[0] + 0,this.parent.launcherPos[1] + 500);
        context.stroke();

        

        if(this.mode == "dragging"){

            //arrow from draggable portion to bird
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

        //bird itself
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
    onmouseup(x,y){
        this.dragging = false;
        if(this.mode == "dragging"){
            this.beginFlight();
        }
    }
    beginFlight(){
        const maxDraggablePixels = 250;
        //dragging beyond 250 pixels should do nothing. But a drag of 250 pixels should result in a speed of 500
        const speed = 2*Math.min(maxDraggablePixels, dist(this.pos,this.dragPos));

        //First, calculate the velocity vector as pos-dragPos, then scale by 1/dist() to normalize it, then set its magnitude to `speed`
        this.velocity = vecScale(vecSub(this.pos,this.dragPos),speed/dist(this.pos,this.dragPos));
        this.mode = "flight";
        this.historyPoints = [];

        //erase all other coord text
        this.parent.eraseCoordText();
        //mark this point as the zero
        this.parent.objects.push(new CoordText(this.parent, [...this.pos], [-100,0]));
    }
}
