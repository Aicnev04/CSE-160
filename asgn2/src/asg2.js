// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_GlobalScaleMatrix;
    void main() {
        gl_Position = u_GlobalScaleMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let u_GlobalScaleMatrix;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext('webgl', { preserveDrawingBuffer: true }); 
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //Required for asgn2
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

    //Get the storage location of u_GlobalScaleMatrix
    u_GlobalScaleMatrix = gl.getUniformLocation(gl.program, 'u_GlobalScaleMatrix');
    if(!u_GlobalScaleMatrix){
        console.log("Failed to get the storage location of u_GlobalScaleMatrix");
        return 0;
    }
}

let g_walkAnimation = false;
let g_legAnimation = false
let g_attackAnimation = false;
let shiftAnimation = false;

let g_globalXAngle = 0;
let g_globalYAngle = 0;
let g_globalZAngle = 0;
let g_walkAngle = 0;
let g_legAngle = 0;

let headXAngle = 0;
let headYAngle = 0;
let headZAngle = 0;

let bodyXAngle = 0;
let bodyYAngle = 0;
let bodyZAngle = 0;

let leftArmXAngle = 0;
let leftArmYAngle = 0;
let leftArmZAngle = 0;

let rightArmXAngle = 0;
let rightArmYAngle = 0;
let rightArmZAngle = 0;

let leftElbowXAngle = 0;
let leftElbowYAngle = 0;
let leftElbowZAngle = 0;

let rightElbowXAngle = 0;
let rightElbowYAngle = 0;
let rightElbowZAngle = 0;

let leftHandXAngle = 0;
let leftHandYAngle = 0;
let leftHandZAngle = 0;

let rightHandXAngle = 0;
let rightHandYAngle = 0;
let rightHandZAngle = 0;

let leftLegXAngle = 0;
let leftLegYAngle = 0;
let leftLegZAngle = 0;

let rightLegXAngle = 0;
let rightLegYAngle = 0;
let rightLegZAngle = 0;

let walkSpeed = 0;
let strut = 0;

let modelColor = [0.15,0.15,0.15,1];

function addActionsForHtmlUI(){
    document.getElementById('angleYSlide').addEventListener('mousemove', function() { g_globalYAngle = this.value; renderScene(); });
    document.getElementById('angleXSlide').addEventListener('mousemove', function() { g_globalXAngle = this.value; renderScene(); });
    document.getElementById('angleZSlide').addEventListener('mousemove', function() { g_globalZAngle = this.value; renderScene(); });
    
    document.getElementById('bodyXSlide').addEventListener('mousemove', function() { bodyXAngle = this.value; renderScene(); });
    document.getElementById('bodyYSlide').addEventListener('mousemove', function() { bodyYAngle = this.value; renderScene(); });
    document.getElementById('bodyZSlide').addEventListener('mousemove', function() { bodyZAngle = this.value; renderScene(); });

    document.getElementById('leftArmXSlide').addEventListener('mousemove', function() { leftArmXAngle = this.value; renderScene(); });
    document.getElementById('leftArmYSlide').addEventListener('mousemove', function() { leftArmYAngle = this.value; renderScene(); });
    document.getElementById('leftArmZSlide').addEventListener('mousemove', function() { leftArmZAngle = this.value; renderScene(); });

    document.getElementById('rightArmXSlide').addEventListener('mousemove', function() { rightArmXAngle = this.value; renderScene(); });
    document.getElementById('rightArmYSlide').addEventListener('mousemove', function() { rightArmYAngle = this.value; renderScene(); });
    document.getElementById('rightArmZSlide').addEventListener('mousemove', function() { rightArmZAngle = this.value; renderScene(); });

    document.getElementById('leftElbowXSlide').addEventListener('mousemove', function() { leftElbowXAngle = this.value; renderScene(); });
    document.getElementById('leftElbowYSlide').addEventListener('mousemove', function() { leftElbowYAngle = this.value; renderScene(); });
    document.getElementById('leftElbowZSlide').addEventListener('mousemove', function() { leftElbowZAngle = this.value; renderScene(); });

    document.getElementById('rightElbowXSlide').addEventListener('mousemove', function() { rightElbowXAngle = this.value; renderScene(); });
    document.getElementById('rightElbowYSlide').addEventListener('mousemove', function() { rightElbowYAngle = this.value; renderScene(); });
    document.getElementById('rightElbowZSlide').addEventListener('mousemove', function() { rightElbowZAngle = this.value; renderScene(); });

    document.getElementById('leftHandXSlide').addEventListener('mousemove', function() { leftHandXAngle = this.value; renderScene(); });
    document.getElementById('leftHandYSlide').addEventListener('mousemove', function() { leftHandYAngle = this.value; renderScene(); });
    document.getElementById('leftHandZSlide').addEventListener('mousemove', function() { leftHandZAngle = this.value; renderScene(); });

    document.getElementById('rightHandXSlide').addEventListener('mousemove', function() { rightHandXAngle = this.value; renderScene(); });
    document.getElementById('rightHandYSlide').addEventListener('mousemove', function() { rightHandYAngle = this.value; renderScene(); });
    document.getElementById('rightHandZSlide').addEventListener('mousemove', function() { rightHandZAngle = this.value; renderScene(); });

    document.getElementById('headXSlide').addEventListener('mousemove', function() { headXAngle = this.value; renderScene(); });
    document.getElementById('headYSlide').addEventListener('mousemove', function() { headYAngle = this.value; renderScene(); });
    document.getElementById('headZSlide').addEventListener('mousemove', function() { headZAngle = this.value; renderScene(); });

    document.getElementById('leftLegXSlide').addEventListener('mousemove', function() { leftLegXAngle = this.value; renderScene(); });
    document.getElementById('leftLegYSlide').addEventListener('mousemove', function() { leftLegYAngle = this.value; renderScene(); });
    document.getElementById('leftLegZSlide').addEventListener('mousemove', function() { leftLegZAngle = this.value; renderScene(); });

    document.getElementById('rightLegXSlide').addEventListener('mousemove', function() { rightLegXAngle = this.value; renderScene(); });
    document.getElementById('rightLegYSlide').addEventListener('mousemove', function() { rightLegYAngle = this.value; renderScene(); });
    document.getElementById('rightLegZSlide').addEventListener('mousemove', function() { rightLegZAngle = this.value; renderScene(); });

    document.getElementById("colorPick").addEventListener("input", function() {
        let color = this.value;
        let r = parseInt(color.slice(1,3), 16) / 255;
        let g = parseInt(color.slice(3,5), 16) / 255;
        let b = parseInt(color.slice(5,7), 16) / 255;
        modelColor = [r, g, b, 1.0];
    });

    document.getElementById('walkAnimationOffButton').onclick = function() {g_walkAnimation=false; g_legAnimation=false;};
    document.getElementById('walkAnimationOnButton').onclick = function() {g_walkAnimation=true; g_legAnimation=true;};

    walkSpeed = document.getElementById("walkSpeedInput");
    strut = document.getElementById("strutInput");

    document.getElementById('attackAnimationOnButton').onclick = function() {g_attackAnimation=true;};
    document.getElementById('attackAnimationOffButton').onclick = function() {g_attackAnimation=false;};
}

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let cameraYaw = 0;   // Horizontal rotation
let cameraPitch = 0; // Vertical rotation

function main() { 
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();

    //Mouse controlled viewing
    canvas.onmousedown = function(ev) {isDragging = true; lastMouseX = ev.clientX; lastMouseY = ev.clientY; };
    canvas.onmousemove = function(ev) {if(isDragging) {convertCoordinatesEventToGL(ev);}};
    canvas.onmouseup = function() {isDragging = false;};
    canvas.addEventListener('wheel', handleScroll);

    //Shift click animation
    canvas.addEventListener('click', function(ev) { if (ev.shiftKey) {shiftAnimation = !shiftAnimation; shiftAngle = 0; shiftLegAngle = 0; shiftHeadAngle = 0; shiftElbowAngle = 0; ev.preventDefault()}; });
    
    gl.clearColor(0.1, 0.2, 0.3, 1);
    requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
function tick(){
    g_seconds = performance.now()/1000.0 - g_startTime;
    updateAnimationAngle();
    renderScene();
    requestAnimationFrame(tick);
}

//Variables related to zoom in/out
let g_zoomLevel = 1.0;
const ZOOM_SPEED = 0.1;
const sensitivity = 0.5; 

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

    return([x, y]);
}

function handleScroll(ev) {
    ev.preventDefault();
    if (ev.deltaY < 0) {
        g_zoomLevel += ZOOM_SPEED; // Zoom in
    } else if (ev.deltaY > 0 && g_zoomLevel > -1.0) {
        g_zoomLevel = Math.max(0.1, g_zoomLevel - ZOOM_SPEED); // Zoom out
    } else{
        g_zoomLevel = 1.0; // Reset zoom
    }
    renderScene();
}

//Variables related to animation
let g_Yangle = 0;
let g_Xangle = 0;
let shiftAngle = 0;
let shiftLegAngle = 0;
let shiftElbowAngle = 0;
let shiftHeadAngle = 0;

function updateAnimationAngle(){
    if(g_walkAnimation){
        shiftAngle = 0;
        g_walkAngle = (strut.value*(Math.sin(g_seconds * walkSpeed.value)));
        g_legAngle = (strut.value*(Math.sin(g_seconds * walkSpeed.value)));
    } 

    if(g_attackAnimation){
        g_Yangle = -cameraYaw;
        if (g_Yangle < -360 || g_Yangle > 360) {
            cameraYaw = 0;
        }
        g_Xangle = -cameraPitch;
    }

    if(shiftAnimation){
        shiftAngle = (360*((g_seconds /2) % 1));
        shiftHeadAngle =(360*((g_seconds) % 1));
        shiftLegAngle = (45*(Math.sin(g_seconds*5)));
        shiftElbowAngle = (45*(Math.sin(g_seconds * 2)));
    }
}

function renderScene(){
    var startTime = performance.now();

    var globalRotMat = new Matrix4().rotate(g_globalYAngle, 0, 1, 0);
    globalRotMat.rotate(g_globalXAngle, 1, 0, 0);
    globalRotMat.rotate(g_globalZAngle, 0, 0, 1);


    //Applies moues rotation to global rotation matrix
    globalRotMat = globalRotMat.multiply(new Matrix4().setRotate(cameraYaw, 0, 1, 0));
    globalRotMat = globalRotMat.multiply(new Matrix4().setRotate(cameraPitch, 1, 0, 0));

    //Applies mouse scroll to global scale matrix
    var globalScaleMat = new Matrix4().scale(1,1,1);
    globalScaleMat = globalScaleMat.multiply(new Matrix4().setScale(g_zoomLevel,g_zoomLevel,g_zoomLevel));

    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    gl.uniformMatrix4fv(u_GlobalScaleMatrix, false, globalScaleMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear([gl.COLOR_BUFFER_BIT]);

    renderModel();

    var duration = performance.now() - startTime;
    sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");
}



function renderModel(){
    //===================-Head-======================
    var head = new Cube();
    head.color = modelColor;
    
    //Ensures the head only faces forward and side when in attack mode
    if(g_Yangle < 90 && g_Yangle > -90 ){
        head.matrix.rotate(g_Yangle, 0, 1 ,0);
    }

    //Overides head animation if attack animations is enabled
    if(!g_attackAnimation){
        head.matrix.rotate(g_walkAngle/2, 0, 1 ,0);

        head.matrix.rotate(shiftHeadAngle, 0, 1, 0);

        head.matrix.rotate(headXAngle, 1, 0, 0);
        head.matrix.rotate(headYAngle, 0, 1, 0);
        head.matrix.rotate(headZAngle, 0, 0, 1);
    }

    head.matrix.translate(-0.5,-0.4,0);
    var headCoordinatesMat = new Matrix4(head.matrix);
    head.matrix.scale(0.5, 0.25, 0.2);
    head.matrix.translate(0.5, 4, -0.3);
    head.render();
    //================================================

    //===================-Eye-======================
    var cutout = new Circle();
    cutout.color = [0.8, 0.2, 0.2, 1];
    cutout.matrix = headCoordinatesMat;
    cutout.matrix.translate(0.5,1.12,-0.061);
    cutout.matrix.scale(12,15,10);
    cutout.render();
    //==============================================

    //================-Attack Beam-=================
    if(g_attackAnimation && (g_Yangle < 90 && g_Yangle > -90)){
            var beam = new Cube()
            beam.color = [0.8, 0.2, 0.2, 1];
            beam.matrix = headCoordinatesMat;
            beam.matrix.translate(0,0,-0.1);
            beam.matrix.scale(0.0005,0.0005,0.5);
            beam.matrix.translate(0,0,-0.8);
            beam.render();
    }
    //==============================================

    //===============-Neck Block-===================
    var neck = new Cube();
    neck.color = modelColor;
    neck.matrix.translate(-0.5,-0.6,0);
    neck.matrix.scale(0.2, 0.05, 0.15);
    neck.matrix.translate(1.9, 22.8, -0.3);
    neck.render();
    //==============================================

    //================-Upper Body-==================
    var upperBody = new Cube();
    upperBody.color = modelColor;

    upperBody.matrix.rotate(g_walkAngle, 0, 1, 0);

    upperBody.matrix.rotate(shiftAngle, 0, 1, 0);

    upperBody.matrix.rotate(bodyXAngle, 1, 0, 0);
    upperBody.matrix.rotate(bodyYAngle, 0, 1, 0);
    upperBody.matrix.rotate(bodyZAngle, 0, 0, 1);

    upperBody.matrix.translate(-0.55,-0.5,-0.5);
    var upperBodyLCoordinatesMat = new Matrix4(upperBody.matrix);
    var upperBodyRCoordinatesMat = new Matrix4(upperBody.matrix);
    upperBody.matrix.scale(0.7, 0.4, 0.3);
    upperBody.matrix.translate(0.22, 1.55, 1.3);
    upperBody.render();
    //==============================================

    //===============-Upper Left Arm================
    var upperArmL = new Cube();
    upperArmL.color = modelColor;
    upperArmL.matrix = upperBodyLCoordinatesMat;    
    upperArmL.matrix.rotate(g_walkAngle/3, 1, 1, 1);
    upperArmL.matrix.translate(g_walkAngle/600, 0, 0);

    upperArmL.matrix.translate(1.0,0,0);
    
    upperArmL.matrix.rotate(5,0,0,1);
    upperArmL.matrix.scale(0.18,0.4,0.22);
    upperArmL.matrix.translate(-0.3,1.55,1.9);

    upperArmL.matrix.rotate(shiftAngle, 1, 0, 0);
    upperArmL.matrix.rotate(leftArmXAngle, 1, 0, 0);
    upperArmL.matrix.rotate(leftArmYAngle, 0, 1, 0);
    upperArmL.matrix.rotate(leftArmZAngle, 0, 0, 1);
    var upperArmLCoordinatesMat = new Matrix4(upperArmL.matrix);
    upperArmL.render();
    //==============================================

    //================-Left Elbow 1-=================
    var elbowL1 = new Cube();
    elbowL1.color = modelColor;
    elbowL1.matrix = upperArmLCoordinatesMat;
    elbowL1.matrix.translate(-0.2,0,0);
    elbowL1.matrix.rotate(5,0,1,0);

    elbowL1.matrix.scale(1.0,0.1,1);
    elbowL1.matrix.translate(0.1,-1.3,0.1);
    elbowL1.render();
    //==============================================

    //==============-Left Elbow 2-==================
    var elbowL2 = new Cube();
    elbowL2.color = modelColor;
    elbowL2.matrix = upperArmLCoordinatesMat;
    elbowL2.matrix.translate(-0.1,-2.1,-0.05);
    elbowL2.matrix.scale(1.2,1.7,1.1);
    elbowL2.matrix.rotate(-2, 0,0, 1);
    elbowL2.render();
    //==============================================

    //===============-Lower Left Arm-================
    var lowerArmL = new Cube();
    lowerArmL.color = modelColor;
    lowerArmL.matrix = upperBodyLCoordinatesMat;
    lowerArmL.matrix.rotate(leftElbowXAngle, 1, 0, 0);
    lowerArmL.matrix.rotate(leftElbowYAngle, 0, 1, 0);
    lowerArmL.matrix.rotate(leftElbowZAngle, 0, 0, 1);
    lowerArmL.matrix.rotate(shiftElbowAngle, 1, 0, 0);
    var lowerArmLCoordinatesMat = new Matrix4(lowerArmL.matrix);
    lowerArmL.matrix.translate(-0.2,-2.0,-0.1);
    lowerArmL.matrix.scale(1.3,1.6,1.25);
    lowerArmL.render();
    //==============================================

    //================-Left Hand-====================
    var handL = new Cube();
    handL.color = modelColor;
    handL.matrix = lowerArmLCoordinatesMat;
    handL.matrix.rotate(leftHandXAngle, 1, 0, 0);
    handL.matrix.rotate(leftHandYAngle, 0, 1, 0);
    handL.matrix.rotate(leftHandZAngle, 0, 0, 1);
    handL.matrix.translate(-0.1,-2.56,0);
    handL.matrix.scale(1.1,0.55,0.95);
    handL.render();
    //==============================================

    //===============-Upper Right Arm================
    var upperArmR = new Cube();
    upperArmR.color = modelColor;
    upperArmR.matrix = upperBodyRCoordinatesMat;
    upperArmR.matrix.rotate(g_walkAngle/3, 1, 1, 1);
    upperArmR.matrix.translate(g_walkAngle/600, 0, 0);
    

    upperArmR.matrix.translate(0.1,0.7,0.42);

    upperArmR.matrix.rotate(shiftAngle, 1, 0, 0);

    upperArmR.matrix.rotate(rightArmXAngle, 1, 0, 0);
    upperArmR.matrix.rotate(rightArmYAngle, 0, 1, 0);
    upperArmR.matrix.rotate(rightArmZAngle, 0, 0, 1);
    

    upperArmR.matrix.rotate(2,0,1,1);
    upperArmR.matrix.scale(0.05,0.3,0.25);


    var upperArmRCoordinatesMat = new Matrix4(upperArmR.matrix);
    upperArmR.render();
    //==============================================

    //==============-Right Elbow 1-=================
    var elbowR1 = new Cube();
    elbowR1.color = modelColor;
    elbowR1.matrix = upperArmRCoordinatesMat;
    elbowR1.matrix.translate(-1,0,0);
    elbowR1.matrix.scale(4,1.3,1);
    elbowR1.matrix.translate(-0.9,-0.4,0);
    elbowR1.render();
    //==============================================

    //=============-Right Elbow 2-==================
    var elbowR2 = new Cube();
    elbowR2.color = modelColor;
    
    elbowR2.matrix = upperArmRCoordinatesMat;
    elbowR2.matrix.translate(0.1,-0.2,0.15);
    elbowR2.matrix.rotate(-10,0,1,0);
    elbowR2.matrix.scale(0.8,0.15,0.7);
    elbowR2.render();
    //==============================================
    
    //============-Lower Right Arm-=================
    var lowerArmR = new Cube();
    lowerArmR.color = modelColor;
    lowerArmR.matrix = upperArmRCoordinatesMat;
    lowerArmR.matrix.translate(-1.5,-2.0,-0.1);
    lowerArmR.matrix.scale(1.5,12,1.6);
        lowerArmR.matrix.rotate(rightElbowXAngle, 1, 0, 0);
    lowerArmR.matrix.rotate(rightElbowYAngle, 0, 1, 0);
    lowerArmR.matrix.rotate(rightElbowZAngle, 0, 0, 1);
    lowerArmR.matrix.rotate(shiftElbowAngle, 1, 0, 0);
    lowerArmR.matrix.translate(0.82,-0.85,-0.15);


    var lowerArmRCoordinatesMat = new Matrix4(lowerArmR.matrix);
    lowerArmR.render();
    //==============================================
    
    //================-Right Hand-==================
    var handR = new Cube();
    handR.color = modelColor;
    handR.matrix = lowerArmRCoordinatesMat;
    handR.matrix.rotate(rightHandXAngle, 1, 0, 0);
    handR.matrix.rotate(rightHandYAngle, 0, 1, 0);
    handR.matrix.rotate(rightHandZAngle, 0, 0, 1);
    handR.matrix.scale(0.8,0.3,0.85);
    handR.matrix.translate(0.12,-1.02,0.1);
    handR.render();
    //==============================================

    //===============-Abdomen-===================
    var ab = new Cube();
    ab.color = modelColor;
    ab.matrix.translate(-0.5,-0.6,0);
    ab.matrix.scale(0.25, 0.1, 0.2);
    ab.matrix.translate(1.3, 6.1, -0.3);
    ab.render();
    //============================================

    //=============-Lower Body-=================
    var lowerBody = new Cube();
    lowerBody.color = modelColor;
    lowerBody.matrix.translate(-0.55,-0.4,0);
    lowerBody.matrix.scale(0.5, 0.25, 0.2);
    lowerBody.matrix.translate(0.5, 0.6, -0.3);
    
    lowerBody.render();
    //==============================================
    
    //=============-Upper Left Leg-=================
    var upperLegL = new Cube();
    upperLegL.color = modelColor;

    
    upperLegL.matrix.rotate(-shiftLegAngle, 1, 0, 0);
    upperLegL.matrix.rotate(leftLegXAngle, 1, 0, 0);
    upperLegL.matrix.rotate(leftLegYAngle, 0, 1, 0);
    upperLegL.matrix.rotate(leftLegZAngle, 0, 0, 1);

    upperLegL.matrix.translate(-0.55,-1.15,-0.5);
    upperLegL.matrix.translate(0, 0, -g_walkAngle/200);



    var upperLegLCoordinatesMat = new Matrix4(upperLegL.matrix);
    upperLegL.matrix.scale(0.22,0.5,0.2);
    upperLegL.matrix.translate(0.7, 1.0, 2.2);
    upperLegL.render();
    //==============================================


    //=============-Upper Right Leg-==================
    var upperLegR = new Cube();
    upperLegR.color = modelColor;

    upperLegR.matrix.rotate(shiftLegAngle, 1, 0, 0);

    upperLegR.matrix.rotate(rightLegXAngle, 1, 0, 0);
    upperLegR.matrix.rotate(rightLegYAngle, 0, 1, 0);
    upperLegR.matrix.rotate(rightLegZAngle, 0, 0, 1);

    upperLegR.matrix.translate(-0.55,-1.15,-0.5);
    upperLegR.matrix.translate(0, 0, g_walkAngle/200);
    var upperLegRCoordinatesMat = new Matrix4(upperLegR.matrix);
    upperLegR.matrix.scale(0.22,0.5,0.2);
    upperLegR.matrix.translate(2.8, 1.0, 2.2);
    upperLegR.render();
    //==============================================

    //===============-Lower Left Leg-==============
    var lowerLegL = new Cube();
    lowerLegL.color = modelColor;
    lowerLegL.matrix = upperLegLCoordinatesMat;
    lowerLegL.matrix.translate(-0.5,0,0.0);
    lowerLegL.matrix.scale(0.18,0.3,0.2);
    lowerLegL.matrix.translate(3.75,0.67,2.2);

    lowerLegL.render();
    //==============================================

    //==============-Lower Right Leg-===============
    var lowerLegR = new Cube();
    lowerLegR.color = modelColor;
    lowerLegR.matrix = upperLegRCoordinatesMat;
    lowerLegR.matrix.translate(0.0,0,0.0);
    lowerLegR.matrix.scale(0.18,0.3,0.2);
    lowerLegR.matrix.translate(3.52,0.67,2.2);
    lowerLegR.render();
}

function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlID){
        console.log("failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}
