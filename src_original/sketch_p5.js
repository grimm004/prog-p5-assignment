/*

Damped Sine Wave 3D

Code originally by Marvin K, marvk.net
https://www.openprocessing.org/user/41086
Adapted for a programming assignment by ------------.

03/12/2018:
Converted from Processing to P5

*/

let l = 0;
let n = 0;
let t = 0.0;

let points = [];

function setup() {
    createCanvas(800, 800, WEBGL);
    background(255);

    noStroke();

    l = 6; //Spacing between points
    n = 51; //Number of points
}

function draw() {
    t = millis()/500;

    background(200);

    camera(width/2, height-100, 200, width/2, height/2, 0, 0, 1, 0);
    //lights();

    points = [];

    translate(width/2, height/2, 0);
    rotateX((mouseY/height));
    rotateZ(TWO_PI-((mouseX/width)*TWO_PI+PI));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            let x2 = (l*i+l/2-l*n/2);
            let y2 = (l*j+l/2-l*n/2);

            let distance = dist(0, 0, x2, y2);
            let z = exp(-distance/50)*sin(((distance)/10)-t)*25;

            points.push(createVector(x2, y2, z));
        }
    }

    noFill();
    stroke(100);

    for (let i = 0; i < n-1; i++) {
        beginShape(QUAD_STRIP);
        let v = createVector(0, 0, 0);
        for (let j = 0; j < n-1; j++) {
            v = points[j+n*i];
/           stroke(127+v.z*10, 127+v.z*5, 127);
            vertex(v.x, v.y, v.z);
            v = points[j+n*(i+1)];
            vertex(v.x, v.y, v.z);
        }
        endShape();
    }

    fill(255, 0, 0);
    noStroke();
}