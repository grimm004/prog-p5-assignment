"use strict";

/*

Process4.reload() - Alessandro Valentino 2017
Inspired by Process 4 by Casey Reas ( http://reas.com/compendium_text/ );
The main modification is in the visualization:the distance
between the centers controls the thickness of the line which is drawn, with color given by interpolating the
colors of the two circles overlapping;

Sketch from https://www.openprocessing.org/sketch/402537

*/

class Process4 {
    constructor(x, y, width, height, col = color(182, 103, 13, 2), elemCount = 160) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.col = col; // Maximum colour of lines
        this.elemCount = elemCount; // Number of elements
        this.speedMultiplier = 1;
        
        this.elements = [];
        
        this.init();
    }
    
    get X() {
        return this.x;
    }
    
    set X(x) {
        this.x = x;
    }
    
    get Y() {
        return this.y;
    }
    
    set Y(y) {
        this.y = y;
    }
    
    get Width() {
        return this.width;
    }
    
    set Width(width) {
        this.width = width;
    }
    
    get Height() {
        return this.height;
    }
    
    set Height(height) {
        this.height = height;
    }
    
    get Colour() {
        return this.colour;
    }
    
    set Colour(colour) {
        this.colour = colour;
    }
    
    set ElemCount(elemCount) {
        this.elemCount = elemCount;
    }
    
    get ElemCount() {
        return this.elemCount;
    }
    
    set SpeedMultiplier(speedMultiplier) {
        this.speedMultiplier = speedMultiplier;
        for (var  i = 0; i < this.elemCount; i++) {
            this.elements[i].speedMultiplier = speedMultiplier;
        }
    }
    
    get SpeedMultiplier() {
        return this.speedMultiplier;
    }
    
    init(resetBackground = true) {
        if (resetBackground) background(255);
        // Distribute the Elements randomly on a line ;
        this.elements = [];

        for (var  i = 0; i < this.elemCount; i++) {
            var s = int(random(0, 2));
            var col = color(this.col.levels[0] * s, this.col.levels[1] * s, this.col.levels[2] * s, this.col.levels[3]); //Randomly choose between black and input colour, with alpha equal to 2;
            this.elements.push(new Element(this.x + random(this.width), this.y + (this.height / 2), random(40, 60), col, this.x + this.width, this.y + this.height, this.speedMultiplier));
        }
    }

    draw(renderer = null) {
        for (var i = 0 ; i < this.elements.length; i++) {
            var el = this.elements[i];

            el.move();
            el.bounce();
        }

        // Checking overlaps
        for (var i = 0; i < this.elements.length; i++) {
            var el = this.elements[i];
            for (var j = i + 1; j < this.elements.length; j++) {
                var el2 = this.elements[j];
                el.onOverlap(el2, renderer);
            }
        }
    }
}

// Define the Element1 class
function Element(x, y, rad, col, maxX, maxY, speedMultiplier) {
    var pos;
    var vel;
    var dir;
    var r;
    var color;

    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.dir = this.vel.copy();
    this.r = rad;
    this.color = col;
    
    this.speedMultiplier = speedMultiplier;
    
    this.bounds = createVector(maxX, maxY);

    // Define movement: every Element moves on a straight line;
    this.move = function() {
        var mag = this.vel.mag(); //Keep track of the velocity;
        
        this.vel.x += (this.dir.x - this.vel.x) * 0.01;  //Slowly change the velocity vector
        this.vel.y += (this.dir.y - this.vel.y) * 0.01; //to agree with the new direction;
        this.vel.normalize();
        this.vel.mult(mag); //Each element will move with the same initial velocity;
        
        this.pos.add(createVector(this.vel.x * this.speedMultiplier, this.vel.y * this.speedMultiplier));
    };

    //Define behaviour when the circles overlap
    this.onOverlap = function(other, renderer) {
        var d = (this.pos.x - other.pos.x) * (this.pos.x - other.pos.x) + (this.pos.y - other.pos.y) * (this.pos.y - other.pos.y); 

        //If touching, we change their direction
        
        if (d == (this.r + other.r) * (this.r + other.r)) {
            this.dir.rotate(0.01 * 2 * PI);
            other.dir.rotate(0.01 * 2 * PI);
        }
        
        // If overlapping, they will move away from their centers;
        if (d < (this.r + other.r) * (this.r + other.r)) {
            this.dir.x = this.pos.x - other.pos.x;
            this.dir.y = this.pos.y - other.pos.y;
            this.dir.normalize();

            //To avoid double counting, we change also the direction of the other Element

            other.dir = this.dir.copy();
            other.dir.mult(-1);

            this.visualize(other, d, renderer);
        }
    };

    /*
    //Use this for debugging purpouses;
    this.show = function() {
        stroke(0,  255);
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
        line(this.pos.x + this.dir.x * this.r, this.pos.y + this.dir.y * this.r, this.pos.x, this.pos.y);
    }
    */

    // Check if the Element touches the edges, in which case it bounces back;
    this.bounce = function() {
        if (this.pos.x < this.r) {
            this.pos.x = this.r;
            this.vel.x = -this.vel.x;
        }

        if (this.pos.x > this.bounds.x - this.r) {
            this.pos.x = this.bounds.x - this.r;
            this.vel.x = -this.vel.x;
        }

        if (this.pos.y < this.r) {
            this.pos.y = this.r;
            this.vel.y = -this.vel.y;
        }

        if (this.pos.y > this.bounds.y - this.r) {
            this.pos.y = this.bounds.y - this.r;
            this.vel.y = -this.vel.y;
        }
    };

    /*Define visualization: draw a line between the centers when they overlap; the distance between
    the centers controls the thickness of the line;
    */
    this.visualize = function(other, d, renderer) {
        var c = map(d, 0, (this.r + other.r) * (this.r + other.r), 1, 0.5);
        noFill();
        if (renderer) {
            renderer.strokeWeight(c * 2);
            renderer.stroke(lerpColor(this.color, other.color, 0.5));
            renderer.line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        }
        else {
            strokeWeight(c * 2);
            stroke(lerpColor(this.color, other.color, 0.5));
            line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        }
    };
}
