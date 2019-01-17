"use strict";

var process4Canvas, process4;


function setup() {
    process4Canvas = createCanvas(1000, 500);
    process4Canvas.parent("process4Demo");
    
    process4 = new Process4(100, 0, 400, 500);
    document.getElementById("restartButton").onclick = function() {
        console.log("Click");
        process4.init();
    }
    
    let elementSpeedSlider = document.getElementById("elementSpeedSlider");
    elementSpeedSlider.oninput = function() {
        process4.SpeedMultiplier = elementSpeedSlider.value;
    }
    
    let elementCountSlider = document.getElementById("elementCountSlider");
    elementCountSlider.oninput = function() {
        process4.ElemCount = elementCountSlider.value;
        process4.init();
    }
}

function draw() {
    process4.draw(process4Canvas);
}