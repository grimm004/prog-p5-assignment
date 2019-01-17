# P5 Summitive Documentation
## Introduction
This will go through the usage of the adapted OpenProcessing sketch available in this API in addition to the provided sample page.

## Process 4
### Description
Process 4 produces a pattern inspired by Process 4 by Casey Reas and runs on a standard 2D canvas. It works by sending many 'elements' around the screen starting from a single horizontal line in the middle, lines are drawn connecting colliding elements to produce the graphic.

### Basic Usage
The elements are interacted with and managed by a Process4 instance from the Process4 class. An Process4 instance is best created as follows.

~~~~
var p4;

function setup() {
    createCanvas(<params>);
    p4 = new Process4(<params>);
}
~~~~

The Process4 class contains a draw function which can take an optional p5.Renderer.
~~~~
p4.draw([renderer])
~~~~
If a P5.Renderer is not provided, the sketch will be drawn directly to the global (default) P5 renderer instance.

~~~~
var p4;

function setup() {
    renderer = createCanvas(<params>);
    p4 = new Process4(<params>);
}

function draw() {
    p4.draw(renderer);
}
~~~~

### Attributes, Functions and Methods
The Process4 class has many attributes that may be changed, most of these can be first initialised when creating an instance of the Process4 class in constructor arguments, these are as follows:

- x: Starting minimum x position of elements.
- y: Minimum y position for elements to go to.
- width: Width of element area.
- height: Height of element area.
- col [default color(182, 103, 13, 2)]: Colour to randomly pick from,
- elemCount [default 160]: Number of elements to be created.


There are a few properties that may be accessed or changed post-initialisation (any of the above attributes can be also be changed during sketch runtime) by getting or setting the following properties:

- X
- Y
- Width
- Height
- Colour
- ElemCount
- SpeedMultiplier: A constant to multiply the speed of all the elements by.

The init method can be called to re-set the sketch, at this point any changes to the properties X, Y, Width, Height, Colour and ElemCount will take effect.

~~~~
p4.init(resetBackground);
~~~~
The resetBackground argument defaults to true and if set will reset the background of the sketch (effectively clearing it).


## Example Page
Included with the source code is an example page which demonstrates the three sketches.
This is found in index.html and index.js.

Within the sample page there are a few examples of the customisation possible in a Process4 instance. These simply use DOM events to set values within a Process4 instance. For example, the element count slider changes the internal count and calls the p4.init() function to put the changes into effect.
