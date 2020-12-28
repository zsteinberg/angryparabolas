export default class GameObject{
    constructor(){
        this.pos = [-50,-50];
        this.clicked = false;
        this.isDead = false;
    }
    
    onclick(){}
    onmouseup(x,y){}
    onmousemove(x,y){}
    onmousedown(x,y){}
    onhover(){}
    update(dt){};
}

