"use strict";

require('./sketches.js');

var dampedOscillation, nightReflection, process4;
var dampedOscillationCanvas, nightReflectionCanvas, process4Canvas;


function setup() {
    dampedOscillationCanvas = createCanvas(500, 500, WEBGL);
    dampedOscillationCanvas.parent("waveDemo");
    
    var fov = 60 / 180 * PI;
    var cameraZ = height / 2.0 / tan(fov / 2.0);
    perspective(fov, width / height, cameraZ * 0.1, cameraZ * 10);

    nightReflectionCanvas = createCanvas(500, 500, WEBGL);
    nightReflectionCanvas.parent("nrDemo");

    process4Canvas = createCanvas(500, 500);
    process4Canvas.parent("p4Demo");

    dampedOscillation = new DampedOscillation();
    nightReflection = new NightReflection(nightReflectionCanvas);
    process4 = new Process4();
}

function draw() {
    dampedOscillationCanvas.background(200);
    orbitControl();
    
    dampedOscillation.draw(dampedOscillationCanvas);
    nightReflection.draw(nightReflectionCanvas);
    process4.draw(process4Canvas);
}

function changeSpeed(value) {
    dampedOscillation.setSpeed(1 / value);
}
