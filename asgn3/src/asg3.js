// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix  * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform sampler2D u_Sampler3;
    uniform sampler2D u_Sampler4;
    uniform sampler2D u_Sampler5;
    uniform sampler2D u_Sampler6;

    uniform int u_whichTexture;

    void main() {
        if(u_whichTexture == -2){
            gl_FragColor = u_FragColor;
        } else if(u_whichTexture == -1){
            gl_FragColor = vec4(v_UV, 1.0, 1.0);
        } else if (u_whichTexture == 0){
            gl_FragColor = texture2D(u_Sampler0, v_UV);
        } else if (u_whichTexture == 1){
            vec4 color = mix(vec4(0.0, 0.1, 0.0, 1.0), texture2D(u_Sampler1, v_UV), 0.4);
            gl_FragColor = color;
        } else if (u_whichTexture == 2){
            gl_FragColor = texture2D(u_Sampler2, v_UV);
        } else if (u_whichTexture == 3){
            gl_FragColor = texture2D(u_Sampler3, v_UV);
        } else if (u_whichTexture == 4){
            gl_FragColor = texture2D(u_Sampler4, v_UV);
        } else if (u_whichTexture == 5){
            gl_FragColor = texture2D(u_Sampler5, v_UV);
        } else if (u_whichTexture == 6){
            gl_FragColor = texture2D(u_Sampler6, v_UV);
        } else{
            gl_FragColor = vec4(1, 0.2, 0.2, 1.0);
        }

    }`

//Global vars
let canvas;
let gl;
let a_Position;
let a_UV
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;
let u_Sampler6;
let u_whichTexture;

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

    // Get the storage location of u_whichTexture
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if(!u_whichTexture){
        console.log("Failed to get the storage location of u_whichTexture");
        return 0;
    }

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
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

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if(!u_ViewMatrix){
        console.log("Failed to get the storage location of u_ViewMatrix");
        return 0;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if(!u_ProjectionMatrix){
        console.log("Failed to get the storage location of u_ProjectionMatrix");
        return 0;
    }

    // Get the storage location of the u_Sampler0
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if(!u_Sampler0){
        console.log("Failed to get the storage location of u_Sampler0");
        return 0;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if(!u_Sampler1){
        console.log("Failed to get the storage location of u_Sampler1");
        return 0;
    }

    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if(!u_Sampler2){
        console.log("Failed to get the storage location of u_Sampler2");
        return 0;
    }

    u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if(!u_Sampler3){
        console.log("Failed to get the storage location of u_Sampler3");
        return 0;
    }

    u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
    if(!u_Sampler4){
        console.log("Failed to get the storage location of u_Sampler4");
        return 0;
    }

    u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
    if(!u_Sampler5){
        console.log("Failed to get the storage location of u_Sampler5");
        return 0;
    }

    u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
    if(!u_Sampler6){
        console.log("Failed to get the storage location of u_Sampler6");
        return 0;
    }
}

//Globals related to UI elements
let g_globalAngle = 0;
let g_FOV = 90;
let g_placingTexture = 2;
let prebuild = false;

function addActionsForHtmlUI(){
    document.getElementById('houseButton').addEventListener('click', function(){prebuild = true;})
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderScene(); });
    document.getElementById('FOVSlide').addEventListener('mousemove', function() { g_FOV = this.value; renderScene(); });

    document.querySelector(".block").addEventListener('change', function() {
        let selectedValue = this.value;
        if(selectedValue === "grassBlock") {
            g_placingTexture = 1;
        } else if(selectedValue === "dirtBlock") {
            g_placingTexture = 2;
        } else if(selectedValue === "woodLogBlock") {
            g_placingTexture = 3;
        } else if(selectedValue === "woodPlankBlock") {
            g_placingTexture = 4;
        } else if(selectedValue === "cobbleBlock") {
            g_placingTexture = 5;
        } else if(selectedValue === "brickBlock") {
            g_placingTexture = 6;
        }
    });
}
 

let cameraYaw = 0;
let cameraPitch = 0;
const sensitivity = 0.1; 

var g_camera = new Camera();
var moveRight = false;
var moveLeft = false;
var moveForward = false;
var moveBack = false;
let shiftDown = false;

var mousePrevX = 0;
var mousePrevY = 0;


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
function tick(){
    g_seconds = performance.now()/1000.0 - g_startTime;
    renderScene();
    requestAnimationFrame(tick);
}


///////////////////////-Main-///////////////////////////
function main() { 
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();


    canvas.onclick = () => canvas.requestPointerLock();
    document.addEventListener("mousemove", (ev) => {
        if (document.pointerLockElement === canvas) {
            cameraYaw   -= ev.movementX * sensitivity;
            cameraPitch -= ev.movementY * sensitivity;;
        }
    });
    
    placeBlock();
    removeBlock();

    document.onkeydown = keydown;
    document.onkeyup = keyup;


    initTextures();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    requestAnimationFrame(tick);
}
///////////////////////////////////////////////////////////


let g_placedCubes = [];

function drawPlacedCubes() {
    for (let placedCube of g_placedCubes) {
        let cube = new Cube();
        cube.color = placedCube.color;
        cube.textureNum = placedCube.textureNum;
        cube.matrix.setTranslate(Math.floor(placedCube.position.elements[0]), Math.floor(placedCube.position.elements[1]), Math.floor(placedCube.position.elements[2]));
        cube.renderfast();
    }
}

function placeBlock(){
    document.addEventListener("mousedown", (ev) => {
        blockExists = false;
        if(ev.button === 0) {
            let newCube = new Cube();
            newCube.color = [1.0, 1.0, 1.0, 1.0];
            let forward = new Vector3(g_camera.at.elements).sub(new Vector3(g_camera.eye.elements)).normalize().mul(2);
            newCube.matrix.setTranslate(g_camera.eye.elements[0] + forward.elements[0], g_camera.eye.elements[1] + forward.elements[1], g_camera.eye.elements[2] + forward.elements[2]);
            newCube.textureNum = g_placingTexture;
            newCube.position = new Vector3(g_camera.eye.elements).add(forward);
            for (let i = 0; i < g_placedCubes.length; i++) {
                let cube = g_placedCubes[i];
                if (Math.floor(cube.position.elements[0]) == Math.floor(newCube.position.elements[0]) &&
                    Math.floor(cube.position.elements[1]) == Math.floor(newCube.position.elements[1]) &&
                    Math.floor(cube.position.elements[2]) == Math.floor(newCube.position.elements[2])) {
                    blockExists = true;
                    break;
                }
            }

            if(!blockExists){
                g_placedCubes.push(newCube);
            }
        }
    });
}

function removeBlock(){
    document.addEventListener("mousedown", (ev) => {
        if(ev.button === 2) {
            let newCube = new Cube();
            newCube.color = [1.0, 1.0, 1.0, 1.0];
            let forward = new Vector3(g_camera.at.elements).sub(new Vector3(g_camera.eye.elements)).normalize().mul(2);
            newCube.matrix.setTranslate(g_camera.eye.elements[0] + forward.elements[0], g_camera.eye.elements[1] + forward.elements[1], g_camera.eye.elements[2] + forward.elements[2]);
            newCube.textureNum = 0;
            newCube.position = new Vector3(g_camera.eye.elements).add(forward);
            for (let i = 0; i < g_placedCubes.length; i++) {
                let cube = g_placedCubes[i];
                if (Math.floor(cube.position.elements[0]) == Math.floor(newCube.position.elements[0]) &&
                    Math.floor(cube.position.elements[1]) == Math.floor(newCube.position.elements[1]) &&
                    Math.floor(cube.position.elements[2]) == Math.floor(newCube.position.elements[2])) {
                    g_placedCubes.splice(i, 1);
                    break;
                }
                
            }
        }
    });
}

function moveCamera(){
    g_camera.pan(cameraYaw, cameraPitch);
    cameraPitch = 0;
    cameraYaw = 0;

    if(moveRight){
        g_camera.right();
    }
    if(moveLeft){
        g_camera.left();
    }
    if(moveForward){
        g_camera.forward();
    }
    if(moveBack){
        g_camera.back();
    }
    if(shiftDown){
        g_camera.speed = 0.2;
        g_FOV = 100;
    }
}

function keyup(ev){
    if(ev.keyCode == 68){
        moveRight = false; 
    }
    if (ev.keyCode == 65){
        moveLeft = false;
    }
    if (ev.keyCode == 87){
        moveForward = false;
    }
    if (ev.keyCode == 83){
        moveBack = false;
    }

    if (shiftDown){
        shiftDown = false;
        g_camera.speed = 0.05;
        g_FOV = 90;
    }
}

function keydown(ev){
    if(ev.keyCode == 68){
        moveRight = true; 
    } else if (ev.keyCode == 65){
       moveLeft = true;
    } else if (ev.keyCode == 87){
        moveForward = true;
    } else if (ev.keyCode == 83){
        moveBack = true;
    } else if (ev.keyCode == 81){
        g_camera.panLeft();
    } else if (ev.keyCode == 69){
        g_camera.panRight();
    } else if(ev.shiftKey){
        shiftDown = true;
    }
}
var g_map = [
    [2,2,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,32,32,32,32,0,0,0,0],
    [2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,0,32,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,0,32,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,0,32,0,0,0],
    [0,0,32,32,32,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,32,32,32,0,0,0,0],
    [0,32,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,32,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,32,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,32,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,32,32,32,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,32,32,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,32,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,32,0,0,0,0,0,1,1,1],
    [0,0,32,32,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,32,0,1,1,1,1,1,2,2],
    [0,32,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,32,32,0,1,1,2,2,2,2,2,3],
    [0,32,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,3,3,3,4],
    [0,32,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,3,3,4,4],
    [0,0,32,32,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,3,3,4,4,4,4],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,3,3,4,4,4,4],
];


function drawMap(){
    var cube = new Cube();
    for(x=0; x<32; x++){
        for(y=0; y<32; y++){
            if(g_map[x][y] == 0){
                cube.textureNum = 1;
                cube.matrix.setTranslate(0, 0, 0);
                cube.matrix.translate(x-16, -2, y-16);
                cube.renderfast()
            }
            if(g_map[x][y] == 1){
                cube.textureNum = 1;
                cube.matrix.setTranslate(0, 0, 0);
                cube.matrix.translate(x-16, -1, y-16);
                cube.renderfast()
            }
            if(g_map[x][y] >= 2){
                for(let i = 0; i < g_map[x][y]; i++){
                    if(g_map[x][y] == 32)
                        cube.textureNum = 3;
                    if(g_map[x][y] < 32)
                        cube.textureNum = 1;
                    cube.matrix.setTranslate(0, 0, 0);
                    cube.matrix.translate(x-16, i-1, y-16);
                    cube.renderfast()
                }
            }
        }
    }
}


function drawSaved(){
    for (let block of savedMap){
        let cube = new Cube();
        cube.color = block.color;
        cube.textureNum = block.textureNum;
        cube.matrix.setTranslate(Math.floor(block.position.elements[0]), Math.floor(block.position.elements[1]), Math.floor(block.position.elements[2]));
        cube.renderfast();
    }
}
function renderScene(){
    var startTime = performance.now();

    var projMat = new Matrix4();
    projMat.setPerspective(g_FOV, canvas.width/canvas.height, 0.1, 2000);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2], 
        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2], 
        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]); //eye, at, up

    // console.log("Camera eye: " + g_camera.eye.elements[0] + ", " + g_camera.eye.elements[1] + ", " + g_camera.eye.elements[2]);
    // console.log("Camera at: " + g_camera.at.elements[0] + ", " + g_camera.at.elements[1] + ", " + g_camera.at.elements[2]);
    // console.log("Camera up: " + g_camera.up.elements[0] + ", " + g_camera.up.elements[1] + ", " + g_camera.up.elements[2]);
    
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    //globalRotMat = globalRotMat.multiply(new Matrix4().setRotate(cameraYaw, 0, 1, 0));
    //globalRotMat = globalRotMat.multiply(new Matrix4().setRotate(cameraPitch, 1, 0, 0));

    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear([gl.COLOR_BUFFER_BIT]);

    moveCamera();
    drawMap();
    drawPlacedCubes();
    renderModel()
    
    if(prebuild)
        drawSaved();


    var sky = new Cube();
    sky.color = [0.4, 0.5, 1.0, 1.0];
    sky.textureNum = 0;
    sky.matrix.scale(32.01,32.01,32.01);
    sky.matrix.translate(-0.5, -0.1, -0.5);
    sky.renderfast();

    var duration = performance.now() - startTime;
    sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");
}

let modelColor = [0.15,0.15,0.15,1];
function renderModel(){
    //===================-Head-======================
    var head = new Cube();
    head.color = modelColor;
    head.matrix.translate(-2,0,8);
    head.matrix.translate(-0.5,-0.4,0);
    var headCoordinatesMat = new Matrix4(head.matrix);
    head.matrix.scale(0.5, 0.25, 0.2);
    head.matrix.translate(0.5, 4, -0.3);
    head.renderfast();
    //================================================


    //===============-Neck Block-===================
    var neck = new Cube();
    neck.color = modelColor;
    neck.matrix.translate(-2,0,8);
    neck.matrix.translate(-0.5,-0.6,0);
    neck.matrix.scale(0.2, 0.05, 0.15);
    neck.matrix.translate(1.9, 22.8, -0.3);
    neck.renderfast();
    //==============================================

    //================-Upper Body-==================
    var upperBody = new Cube();
    upperBody.color = modelColor;
    upperBody.matrix.translate(-2,0,8);
    upperBody.matrix.translate(-0.55,-0.5,-0.5);
    var upperBodyLCoordinatesMat = new Matrix4(upperBody.matrix);
    var upperBodyRCoordinatesMat = new Matrix4(upperBody.matrix);
    upperBody.matrix.scale(0.7, 0.4, 0.3);
    upperBody.matrix.translate(0.22, 1.55, 1.3);
    upperBody.renderfast();
    //==============================================

    //===============-Upper Left Arm================
    var upperArmL = new Cube();
    upperArmL.color = modelColor;
    upperArmL.matrix.translate(-2,0,8);
    upperArmL.matrix = upperBodyLCoordinatesMat;    

    upperArmL.matrix.translate(1.0,0,0);
    
    upperArmL.matrix.rotate(5,0,0,1);
    upperArmL.matrix.scale(0.18,0.4,0.22);
    upperArmL.matrix.translate(-0.3,1.55,1.9);

    var upperArmLCoordinatesMat = new Matrix4(upperArmL.matrix);
    upperArmL.renderfast();
    //==============================================

    //================-Left Elbow 1-=================
    var elbowL1 = new Cube();
    elbowL1.color = modelColor;
    elbowL1.matrix = upperArmLCoordinatesMat;
    elbowL1.matrix.translate(-0.2,0,0);
    elbowL1.matrix.rotate(5,0,1,0);

    elbowL1.matrix.scale(1.0,0.1,1);
    elbowL1.matrix.translate(0.1,-1.3,0.1);
    elbowL1.renderfast();
    //==============================================

    //==============-Left Elbow 2-==================
    var elbowL2 = new Cube();
    elbowL2.color = modelColor;
    elbowL2.matrix = upperArmLCoordinatesMat;
    elbowL2.matrix.translate(-0.1,-2.1,-0.05);
    elbowL2.matrix.scale(1.2,1.7,1.1);
    elbowL2.matrix.rotate(-2, 0,0, 1);
    elbowL2.renderfast();
    //==============================================

    //===============-Lower Left Arm-================
    var lowerArmL = new Cube();
    lowerArmL.color = modelColor;
    lowerArmL.matrix = upperBodyLCoordinatesMat;
    var lowerArmLCoordinatesMat = new Matrix4(lowerArmL.matrix);
    lowerArmL.matrix.translate(-0.2,-2.0,-0.1);
    lowerArmL.matrix.scale(1.3,1.6,1.25);
    lowerArmL.renderfast();
    //==============================================

    //================-Left Hand-====================
    var handL = new Cube();
    handL.color = modelColor;
    handL.matrix = lowerArmLCoordinatesMat;
    handL.matrix.translate(-0.1,-2.56,0);
    handL.matrix.scale(1.1,0.55,0.95);
    handL.renderfast();
    //==============================================

    //===============-Upper Right Arm================
    var upperArmR = new Cube();
    upperArmR.color = modelColor;
    upperArmR.matrix = upperBodyRCoordinatesMat;

    upperArmR.matrix.translate(0.1,0.7,0.42);

    upperArmR.matrix.rotate(2,0,1,1);
    upperArmR.matrix.scale(0.05,0.3,0.25);


    var upperArmRCoordinatesMat = new Matrix4(upperArmR.matrix);
    upperArmR.renderfast();
    //==============================================

    //==============-Right Elbow 1-=================
    var elbowR1 = new Cube();
    elbowR1.color = modelColor;
    elbowR1.matrix = upperArmRCoordinatesMat;
    elbowR1.matrix.translate(-1,0,0);
    elbowR1.matrix.scale(4,1.3,1);
    elbowR1.matrix.translate(-0.9,-0.4,0);
    elbowR1.renderfast();
    //==============================================

    //=============-Right Elbow 2-==================
    var elbowR2 = new Cube();
    elbowR2.color = modelColor;
    
    elbowR2.matrix = upperArmRCoordinatesMat;
    elbowR2.matrix.translate(0.1,-0.2,0.15);
    elbowR2.matrix.rotate(-10,0,1,0);
    elbowR2.matrix.scale(0.8,0.15,0.7);
    elbowR2.renderfast();
    //==============================================
    
    //============-Lower Right Arm-=================
    var lowerArmR = new Cube();
    lowerArmR.color = modelColor;
    lowerArmR.matrix = upperArmRCoordinatesMat;
    lowerArmR.matrix.translate(-1.5,-2.0,-0.1);
    lowerArmR.matrix.scale(1.5,12,1.6);

    lowerArmR.matrix.translate(0.82,-0.85,-0.15);


    var lowerArmRCoordinatesMat = new Matrix4(lowerArmR.matrix);
    lowerArmR.renderfast();
    //==============================================
    
    //================-Right Hand-==================
    var handR = new Cube();
    handR.color = modelColor;
    handR.matrix = lowerArmRCoordinatesMat;

    handR.matrix.scale(0.8,0.3,0.85);
    handR.matrix.translate(0.12,-1.02,0.1);
    handR.renderfast();
    //==============================================

    //===============-Abdomen-===================
    var ab = new Cube();
    ab.color = modelColor;
    ab.matrix.translate(-2,0,8);
    ab.matrix.translate(-0.5,-0.6,0);
    ab.matrix.scale(0.25, 0.1, 0.2);
    ab.matrix.translate(1.3, 6.1, -0.3);
    ab.renderfast();
    //============================================

    //=============-Lower Body-=================
    var lowerBody = new Cube();
    lowerBody.color = modelColor;
    lowerBody.matrix.translate(-2,0,8);
    lowerBody.matrix.translate(-0.55,-0.4,0);
    lowerBody.matrix.scale(0.5, 0.25, 0.2);
    lowerBody.matrix.translate(0.5, 0.6, -0.3);
    
    lowerBody.renderfast();
    //==============================================
    
    //=============-Upper Left Leg-=================
    var upperLegL = new Cube();
    upperLegL.color = modelColor;
    upperLegL.matrix.translate(-2,0,8);

    upperLegL.matrix.translate(-0.55,-1.15,-0.5);

    var upperLegLCoordinatesMat = new Matrix4(upperLegL.matrix);
    upperLegL.matrix.scale(0.22,0.5,0.2);
    upperLegL.matrix.translate(0.7, 1.0, 2.2);
    upperLegL.renderfast();
    //==============================================


    //=============-Upper Right Leg-==================
    var upperLegR = new Cube();
    upperLegR.color = modelColor;
    upperLegR.matrix.translate(-2,0,8);

    upperLegR.matrix.translate(-0.55,-1.15,-0.5);
    var upperLegRCoordinatesMat = new Matrix4(upperLegR.matrix);
    upperLegR.matrix.scale(0.22,0.5,0.2);
    upperLegR.matrix.translate(2.8, 1.0, 2.2);
    upperLegR.renderfast();
    //==============================================

    //===============-Lower Left Leg-==============
    var lowerLegL = new Cube();
    lowerLegL.color = modelColor;
    lowerLegL.matrix = upperLegLCoordinatesMat;
    lowerLegL.matrix.translate(-0.5,0,0.0);
    lowerLegL.matrix.scale(0.18,0.3,0.2);
    lowerLegL.matrix.translate(3.75,0.67,2.2);

    lowerLegL.renderfast();
    //==============================================

    //==============-Lower Right Leg-===============
    var lowerLegR = new Cube();
    lowerLegR.color = modelColor;
    lowerLegR.matrix = upperLegRCoordinatesMat;
    lowerLegR.matrix.translate(0.0,0,0.0);
    lowerLegR.matrix.scale(0.18,0.3,0.2);
    lowerLegR.matrix.translate(3.52,0.67,2.2);
    lowerLegR.renderfast();
}

function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlID){
        console.log("failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}
