import MainSimulation from './main.js';
window.angrybirds = new MainSimulation();

document.addEventListener('DOMContentLoaded', function(){
    window.angrybirds.start();
}, false);
    
