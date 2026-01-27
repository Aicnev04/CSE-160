// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext('webgl', { preserveDrawingBuffer: true }); 
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
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

    //Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(!u_ModelMatrix){
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    //Get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if(!u_GlobalRotateMatrix){
        console.log("Failed to get the storage location of u_GlobalRotateMatrix");
        return 0;
    }
}

//Globals related to UI elements
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;

function addActionsForHtmlUI(){
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderScene(); });
    document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderScene(); });
    document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderScene(); });

    document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation=false; g_magentaAnimation=false;};
    document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation=true; g_magentaAnimation=true;};
}
 

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let cameraYaw = 0;
let cameraPitch = 0;
const sensitivity = 0.5; 

function main() { 
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();

    canvas.onmousedown = function(ev) {isDragging = true; lastMouseX = ev.clientX; lastMouseY = ev.clientY; };
    canvas.onmousemove = function(ev) {if(isDragging) {convertCoordinatesEventToGL(ev);}};
    canvas.onmouseup = function() {isDragging = false;};
    

    gl.clearColor(0.5, 0.5, 0.7, 1.0);
    requestAnimationFrame(tick);
}


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
function tick(){
    g_seconds = performance.now()/1000.0 - g_startTime;
    //console.log(g_seconds);

    updateAnimationAngle();
    renderScene();
    requestAnimationFrame(tick);
}



function convertCoordinatesEventToGL(ev){
    ev.preventDefault();
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    const deltaX = ev.clientX - lastMouseX;
    const deltaY = ev.clientY - lastMouseY;

    cameraYaw -= deltaX * sensitivity;
    cameraPitch += deltaY * sensitivity; 

    lastMouseX = ev.clientX;
    lastMouseY = ev.clientY;
    console.log("X: " + deltaX + " Y:" + deltaY);



    return([x, y]);
}

function updateAnimationAngle(){
    if(g_yellowAnimation){
        g_yellowAngle = (45*(Math.sin(g_seconds)));
    } 
    if(g_magentaAnimation){
        g_magentaAngle = (360*(g_seconds % 1));
    }
}

function renderScene(){
    var startTime = performance.now();

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    globalRotMat = globalRotMat.multiply(new Matrix4().setRotate(cameraYaw, 0, 1, 0));
    globalRotMat = globalRotMat.multiply(new Matrix4().setRotate(cameraPitch, 1, 0, 0));


    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear([gl.COLOR_BUFFER_BIT]);


    var k = 10;
    for (var i =1; i < k; i++){
        var c = new Cube();
        c.matrix.translate(-0.8, 1.9 * i/k-1.0, 0);
        c.matrix.rotate(g_seconds*500, 1, 1, 1);
        c.matrix.scale(0.1, 0.5/k, 1.0/k);
        c.render();
    }


    var leftArm = new Cube();
    leftArm.color = [1.0, 1.0, 0.0, 1.0];
    leftArm.matrix.setTranslate(0.0, -0.5, 0.0);
    leftArm.matrix.rotate(g_yellowAngle,-0,0,1);
    var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
    leftArm.matrix.scale(0.25, 0.7, 0.5);
    leftArm.matrix.translate(-0.5, 0.0, 0.0);
    leftArm.render();

    var box = new Cube();
    box.color = [1,0,1,1];
    box.matrix = yellowCoordinatesMat;
    box.matrix.translate(0,0.65,0);
    box.matrix.rotate(g_magentaAngle,0,0,1);
    box.matrix.scale(0.3, 0.3, 0.3);
    box.matrix.translate(-0.5, 0, -0.001);
    box.render();

    var duration = performance.now() - startTime;

    sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");
}

function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlID){
        console.log("failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}
