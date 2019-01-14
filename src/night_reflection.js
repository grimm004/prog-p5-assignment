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
        this.shader_.setUniform('iMouse', [mouseX, mouseY]);
        this.shader_.setUniform("noctaves", this.noctaves);
        this.shader_.setUniform("c", this.c);
        
        if (renderer) {
            renderer.shader(this.shader_);
            renderer.box(width / 2);
        }
        else {
            shader(this.shader_);
            box(width / 2);
        }
    }
}

var nr;
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    nr = new NightReflection();
}

function draw() {
    nr.draw();
}
