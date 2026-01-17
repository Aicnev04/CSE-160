// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`

//Global vars
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext('webgl', { preserveDrawingBuffer: true }); 
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    //Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//Globals related to UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let circleSegments = 10;
let symmetryLine = false;

function addActionsForHtmlUI(){
    //Color related actions
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0,1.0,0.0,1.0]; };
    document.getElementById('red').onclick = function() { g_selectedColor = [1.0,0.0,0.0,1.0]; };
    document.getElementById('blue').onclick = function() { g_selectedColor = [0.0,0.0,1.0,1.0]; };
    document.getElementById("colorPick").addEventListener("input", function() {
        let color = this.value;
        let r = parseInt(color.slice(1,3), 16) / 255;
        let g = parseInt(color.slice(3,5), 16) / 255;
        let b = parseInt(color.slice(5,7), 16) / 255;
        document.getElementById('redSlide').value = r * 100;
        document.getElementById('greenSlide').value = g * 100;
        document.getElementById('blueSlide').value = b * 100;
        g_selectedColor = [r, g, b, 1.0];
    });

    document.getElementById('redSlide').addEventListener('mouseup', function() { 
        g_selectedColor[0] = this.value/100;
        g_selectedColor[1] = document.getElementById('greenSlide').value / 100;
        g_selectedColor[2] = document.getElementById('blueSlide').value / 100;
    });

    document.getElementById('greenSlide').addEventListener('mouseup', function() { 
        g_selectedColor[1] = this.value/100;
        g_selectedColor[0] = document.getElementById('redSlide').value / 100;
        g_selectedColor[2] = document.getElementById('blueSlide').value / 100;
    });

    document.getElementById('blueSlide').addEventListener('mouseup', function() { 
        g_selectedColor[2] = this.value/100;
        g_selectedColor[0] = document.getElementById('redSlide').value / 100;
        g_selectedColor[1] = document.getElementById('greenSlide').value / 100;
    });

    //Canvas related actions
    document.getElementById('clearButton').onclick = function() { g_shapesList = []; renderAllShapes(); };
    document.getElementById('showImage').onclick = function() {g_shapesList = []; renderAllShapes(); createImage(); }; 
    document.getElementById('symmetryLine').onclick = function() { symmetryLine = this.checked; };

    //Brush related actions
    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
    document.getElementById('segmentSlide').addEventListener('mouseup', function() { circleSegments = this.value; });
    document.getElementById('pointButton').onclick = function() { g_selectedType = POINT; };
    document.getElementById('triButton').onclick = function() { g_selectedType = TRIANGLE; };
    document.getElementById('circleButton').onclick = function() { g_selectedType = CIRCLE; };
}
 
function main() { 
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();

    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };
    
    // Add mouse wheel event listener for zooming
    canvas.addEventListener('wheel', handleScroll);

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x, y]);
}

let g_shapesList = [];
let symPoint;

function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);

  let point;

  if(g_selectedType == POINT){
    point = new Point();
  }
  else if(g_selectedType == TRIANGLE){
    point = new Triangle();
  } 
  else{
    point = new Circle();
    point.segments = circleSegments;
  }

  point.position = [x / g_zoomLevel, y / g_zoomLevel];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);
  
  if(symmetryLine){
    symPoint = Object.create(point);
    symPoint.position = [-x / g_zoomLevel, y / g_zoomLevel];
    g_shapesList.push(symPoint);
  }

  renderAllShapes();
}

// Globals related to zoom
let g_zoomLevel = 1.0;
const ZOOM_SPEED = 0.2;

function handleScroll(ev) {
    ev.preventDefault();
    
    if (ev.deltaY < 0) {
        g_zoomLevel += ZOOM_SPEED; // Zoom in
    } else if (ev.deltaY > 0 && g_zoomLevel > 1.0) {
        g_zoomLevel = Math.max(0.1, g_zoomLevel - ZOOM_SPEED); // Zoom out
    } else{
        g_zoomLevel = 1.0; // Reset zoom
    }

    console.log("Zoom Level: " + g_zoomLevel);
    
    renderAllShapes();
}

function renderAllShapes(){
    var startTime = performance.now();

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }

    var duration = performance.now() - startTime;
    sendTextToHTML("numdot: "+ len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");
}

function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlID){
        console.log("failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}
