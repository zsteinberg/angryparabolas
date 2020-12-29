import DraggableBird from './DraggableBird.js';
import CoordinateSystem from './CoordinateSystem.js';
import CoordText from './CoordText.js';
import { dist } from './helperfuncs.js';

export default class MainSimulation{

    constructor(){
        this.objects = [];
    }

    start(){

        this.canvas = document.getElementById("canvas");
        this.context = canvas.getContext('2d');
        this.updateCanvasSize();
        this.last_t = Date.now() / 1000;
        this.t_accum = 0;

        this.updateCanvasSize();

        window.addEventListener("mousemove", this.onmousemove.bind(this));
        window.addEventListener("mousedown", this.onmousedown.bind(this));
        window.addEventListener("mouseup", this.onmouseup.bind(this));

        window.addEventListener("touchmove", this.ontouchmove.bind(this),{'passive':false});
        window.addEventListener("touchstart", this.ontouchstart.bind(this),{'passive':false});
        window.addEventListener("touchend", this.onmouseup.bind(this),{'passive':false});
        window.addEventListener("touchcancel", this.onmouseup.bind(this),{'passive':false});

        this.coordinateSystem = new CoordinateSystem(this);
        this.objects.push(this.coordinateSystem);
        this.objects.push(new DraggableBird(this));

        this.update();
    }

    eraseCoordText(){
        for(var i=0;i<this.objects.length;i++){
            if(this.objects[i].constructor === CoordText){
                this.objects[i].isDead = true;
            }
        }
    }

    updateCanvasSize(){
        //if we don't need to update, don't
        if(this.canvas.width == window.innerWidth){
            return;
        }
        this.canvas.width = this.width = window.innerWidth;
        this.canvas.height = this.height = window.innerHeight;

        this.centerPos = [this.width/2, this.height/2];
        this.launcherPos = [this.width/3, this.height*2/3];
        this.eraseCoordText();
    }


    ontouchmove(event){
        event.preventDefault();

        let rect = this.canvas.getBoundingClientRect();
        
        for(var i=0;i<event.touches.length;i++){
            let touch = event.touches[i];
            this.onmousemove({x: touch.clientX - rect.left, y: touch.clientY- rect.top});
        }

    }

    onmousemove(event){
        let x = event.x;
        let y = event.y;
        for(var i=0;i<this.objects.length;i++){
            this.objects[i].onmousemove(x,y);
        }
    }

    ontouchstart(event){
        if(event.target == this.canvas)event.preventDefault();

        let rect = this.canvas.getBoundingClientRect();

        for(var i=0;i<event.touches.length;i++){
            let touch = event.touches[i];
            this.onmousedown({x: touch.clientX - rect.left, y: touch.clientY- rect.top});
        }
    }

    onmousedown(event){
        let x = event.x;
        let y = event.y;
        for(var i=0;i<this.objects.length;i++){
            this.objects[i].onmousedown(x,y);
        }
    }

    onmouseup(event){
        let x = event.x;
        let y = event.y;

        for(var i=0;i<this.objects.length;i++){
           this.objects[i].onmouseup(x,y);
           this.objects[i].clicked = false;
        }
    }

    update(){
        let context = this.context;
        const t = Date.now() / 1000;
        const dt = t-this.last_t;
        this.last_t = t;

        this.t_accum += dt;
        while(this.t_accum > 1/60){
            for(var i=0;i<this.objects.length;i++){
                this.objects[i].update(1/60);
            }                    
            this.t_accum -= 1/60;
        }

        this.objects = this.objects.filter( (x)=>!x.isDead);

        this.updateCanvasSize();

        //clear canvas
        this.canvas.width = this.canvas.width;
        context.fillStyle = "#EDEFFD";
        context.fillRect(0,0,this.width,this.height);


        for(var i=0;i<this.objects.length;i++){
            this.objects[i].draw(context);
        }
        window.requestAnimationFrame(this.update.bind(this));
    }
}
