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


/*

Process4.reload() - Alessandro Valentino 2017
Inspired by Process 4 by Casey Reas ( http://reas.com/compendium_text/ );
The main modification is in the visualization:the distance
between the centers controls the thickness of the line which is drawn, with color given by interpolating the
colors of the two circles overlapping;

Sketh from https://www.openprocessing.org/sketch/402537

*/

class Process4 {
    constructor(x, y, width, height, col = color(182, 103, 13, 2), tot = 160) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.col = col; // Maximum colour of lines
        this.tot = tot; // Number of elements
        
        this.elements = [];
        
        this.init();
    }
    
    getX() {
        return this.x;
    }
    
    setX(x) {
        this.x = x;
    }
    
    getY() {
        return this.y;
    }
    
    setY(y) {
        this.y = y;
    }
    
    getWidth() {
        return this.width;
    }
    
    setWidth(width) {
        this.width = width;
    }
    
    getHeight() {
        return this.height;
    }
    
    setHeight(height) {
        this.height = height;
    }
    
    init() {
        // Distribute the Elements randomly on a line ;
        this.elements = [];

        for (var  i = 0; i < this.tot; i++) {
            var s = int(random(0, 2));
            var col = color(this.col.levels[0] * s, this.col.levels[1] * s, this.col.levels[2] * s, this.col.levels[3]); //Randomly choose between black and input colour, with alpha equal to 2;
            this.elements.push(new Element(this.x + random(this.width), this.y + (this.height / 2), random(40, 60), col, this.x + this.width, this.y + this.height));
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
function Element(x, y, rad, col, maxX, maxY) {
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
    
    this.bounds = createVector(maxX, maxY);

    // Define movement: every Element moves on a straight line;
    this.move = function() {
        var mag = this.vel.mag(); //Keep track of the velocity;
        
        this.vel.x += (this.dir.x - this.vel.x) * 0.01;  //Slowly change the velocity vector
        this.vel.y += (this.dir.y - this.vel.y) * 0.01; //to agree with the new direction;
        this.vel.normalize();
        this.vel.mult(mag); //Each element will move with the same initial velocity;

        this.pos.add(this.vel);
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


/*

Night Reflection by Pierre MARZIN

Sketch from https://www.openprocessing.org/sketch/623979

*/

"use strict";

// Shader Definitions
const frag = `

// Author Pierre MARZIN 01/2017

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;
uniform int noctaves;
uniform float c[22];
float mousefactor;

float noise( in vec2 x )
{
    return sin(1.5 * x.x) * sin(1.5 * x.y);
}

const mat2 rot = mat2( 0.80,  0.6, -0.6,  0.8 );
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.6;
    vec2 shift = 10.0 * vec2(c[11], c[12]);
    for (int i = 0; i < 12; ++i) { //noprotect
        if(i >= noctaves) break;
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 mouse = iMouse / iResolution;
    vec2 st = (-iResolution.xy + 2.0 * gl_FragCoord.xy) / iResolution.y; //(gl_FragCoord.xy/iResolution.xy);//
    vec3 color = vec3(0.);
    vec2 q = vec2(0.);
    q.x = fbm(st + vec2(c[0], c[1] * .01 * iTime));
    q.y = fbm(st + vec2(c[2], c[3]));
    vec2 r = vec2(0.);

    //play with the values here!
    r.x = fbm(st + (3.0 * mouse.x + 0.4) * q + vec2(c[5], c[6]));
    r.y = fbm(st + (6.0 * mouse.y + 0.5) * q * sin(.01 * iTime) + vec2(c[8] * .05 * iTime, c[9]));
    float f = fbm(st + c[10] * (r + length(q)));
    color = smoothstep(vec3(0.101961, 0.19608, 0.666667), vec3(0.666667, 0.666667, 0.98039), color);
    color = mix(color, vec3(1.856, .05 * (1.0 + cos(1.5 + .2 * iTime)), 0.164706), r.y + length(q));
    color = mix(color, vec3(1.5 * sin(.1 * iTime), 0.0, cos(.13 * iTime)), length(r + q)); //.2+.2*(1.0+cos(0.5+.3*iTime))
    color = mix(color, vec3(0.9, 0.9, 0.9), dot(r, r));
    color *= (1.5 * f * f * f + 1.8 * f * f + 1.7 * f);
    color += .4 * vec3(1.8 + r.x, 0.7 + q);
    color = pow(color, vec3(.5));

    gl_FragColor = vec4(color, 1.);
}

`;

const vert = `

//standard vertex shader
#ifdef GL_ES
precision highp float;
#endif
#extension GL_OES_standard_derivatives : enable
// attributes, in
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;
attribute vec4 aVertexColor;

// attributes, out
varying vec3 var_vertPos;
varying vec4 var_vertCol;
varying vec3 var_vertNormal;
varying vec2 var_vertTexCoord;

// matrices
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);

    // just passing things through
    var_vertPos      = aPosition;
    var_vertCol      = aVertexColor;
    var_vertNormal   = aNormal;
    var_vertTexCoord = aTexCoord;
}

`;


class NightReflection {
    constructor(noctaves = 4, renderer = null) {
        this.noctaves = noctaves;
        this.c = [];
        
        if (renderer) {
            this.shader_ = new p5.Shader(renderer, vert, frag); // shaders are loaded
            renderer.shader(this.shader_); // shaders are applied
        }
        else {
            this.shader_ = new p5.Shader(this._renderer, vert, frag); // shaders are loaded
            shader(this.shader_); // shaders are applied
        }
        
        this.initc();
    }

    initc() {
        for (var i = 0; i < 22; i++) {
            this.c[i] = random(-5, 5);
        }
    }
    
    draw(renderer = null) {
        this.shader_.setUniform("iResolution", [width, height]); //pass some values to the shader
        this.shader_.setUniform("iTime", millis() * .001);
        this.shader_.setUniform("iMouse", [mouseX, mouseY]);
        this.shader_.setUniform("noctaves", this.noctaves);
        this.shader_.setUniform("c", this.c);
        
        if (renderer) {
            shader(this.shader_);
            box(width / 2);
        }
        else {
            shader(this.shader_);
            box(width / 2);
        }
    }
}
