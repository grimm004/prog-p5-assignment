/*

Damped Sine Wave 3D

Code originally by Marvin K, marvk.net
https://www.openprocessing.org/user/41086
Adapted for a programming assignment by ------------.

03/12/2018:
Converted from Processing to P5

*/

"use strict";

// The main DampedOscillation class
class DampedOscillation {
    constructor(speed = 1/500, spacing = 6, n = 51, oscillationFunction = sin, damperFunction = function(dist) { return exp(-dist/50); }) {
        // Oscillation speed
        this.speed = speed;
        // Spacing between points
        this.l = spacing;
        // Number of points
        this.n = n;
        // Oscillation function
        this.oscillationFunction = oscillationFunction;
        // Distance multiplier function
        this.damperFunction = damperFunction;
        
        // Private fields (for time and point storage)
        this.t = 0.0;
        this.points = [];
    }
    
    // Returns the oscillation function
    getOscillation() {
        return this.oscillationFunction;
    }

    // Sets the oscillation function
    setOscillation(f) {
        this.oscillationFunction = f;
    }
    
    // Gets the damper function
    getDamper() {
        return this.damperFunction;
    }
    
    // Sets the damper function
    setDamper(f) {
        this.damperFunction = f;
    }
    
    // Gets the oscillation speed
    getSpeed() {
        return this.speed;
    }
    
    // Sets the oscillation speed
    setSpeed(speed) {
        this.speed = speed;
    }
    
    // Draws the oscillation visualisation
    draw(renderer = null) {
        this.t = this.speed * millis();

        this.points = [];

        // For each point in the grid...
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                // Calculate the positions of the points and add them to the points array.
                let x2 = (this.l*i+this.l/2-this.l*this.n/2);
                let y2 = (this.l*j+this.l/2-this.l*this.n/2);

                let distance = dist(0, 0, x2, y2);
                let z = this.damperFunction(distance)*this.oscillationFunction(((distance)/10)-this.t)*25;

                this.points.push(createVector(x2, y2, z));
            }
        }

        // Setup canvas for drawing the points
        noFill();
        stroke(100);

        // Draw the points
        for (let i = 0; i < this.n-1; i++) {
            beginShape(QUAD_STRIP);
            let v = createVector(0, 0, 0);
            for (let j = 0; j < this.n-1; j++) {
                v = this.points[j+this.n*i];
                stroke(127+v.z*10, 127+v.z*5, 127);
                vertex(v.x, v.y, v.z);
                v = this.points[j+this.n*(i+1)];
                vertex(v.x, v.y, v.z);
            }
            endShape();
        }

        fill(255, 0, 0);
        noStroke();
    }
}
