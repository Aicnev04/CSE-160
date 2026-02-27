// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    attribute vec4 a_Normal;

    varying vec2 v_UV;
    varying vec3 v_Normal;
    varying vec4 v_VertPos;

    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_NormalMatrix;

    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix  * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
        v_VertPos = u_ModelMatrix * a_Position;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform sampler2D u_Sampler3;
    uniform sampler2D u_Sampler4;
    uniform sampler2D u_Sampler5;
    uniform sampler2D u_Sampler6;
    uniform int u_whichTexture;
    uniform vec3 u_lightPos;
    uniform vec3 u_lightColor;
    uniform vec3 u_cameraPos;
    uniform float u_specularValue;
    uniform float u_diffuseValue;
    uniform float u_ambientValue;
    uniform bool u_activeLights;

    varying vec4 v_VertPos;
    varying vec2 v_UV;
    varying vec3 v_Normal;

    vec4 pointLight(){
            vec3 lightVector = u_lightPos - vec3(v_VertPos);
            float r = length(lightVector);
            gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1.0);

            vec3 L = normalize(lightVector);
            vec3 N = normalize(v_Normal);
            float nDotL = max(dot(N,L), u_diffuseValue);

            vec3 R = -reflect(L,N);
            vec3 E = normalize(u_cameraPos-vec3(v_VertPos));
            float specular = pow(max(dot(E,R), 0.0), u_specularValue);
            vec3 diffuse = vec3(gl_FragColor) * nDotL;
            vec3 ambient = vec3(gl_FragColor) * u_ambientValue;
            return vec4(u_lightColor * (specular + diffuse + ambient), 1.0);
    }


    void main() {
        if(u_whichTexture == -3){
            gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
        } else if(u_whichTexture == -2){
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

        if(u_activeLights == true){
            if(u_whichTexture != -2){
                gl_FragColor = pointLight();
            }
        }
    }`

//Global vars
let canvas;
let gl;
let program;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_NormalMatrix
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;
let u_Sampler6;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_specularValue;
let u_diffuseValue;
let u_ambientValue;
let u_lightColor;
let u_activeLights;

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

    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if(a_Normal < 0){
        console.log('Failed to get the storage location of a_Normal');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
        console.log('Failed to get the storage location of u_lightPos');
        return;
    }

    u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
    if (!u_lightColor) {
        console.log('Failed to get the storage location of u_lightColor');
        return;
    }

    u_activeLights = gl.getUniformLocation(gl.program, 'u_activeLights');
    if (!u_activeLights) {
        console.log('Failed to get the storage location of u_activeLights');
        return;
    }

    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if (!u_cameraPos) {
        console.log('Failed to get the storage location of u_cameraPos');
        return;
    }

    u_specularValue = gl.getUniformLocation(gl.program, 'u_specularValue');
    if (!u_specularValue) {
        console.log('Failed to get the storage location of u_specularValue');
        return;
    }

    u_diffuseValue = gl.getUniformLocation(gl.program, 'u_diffuseValue');
    if (!u_diffuseValue) {
        console.log('Failed to get the storage location of u_diffuseValue');
        return;
    }

    u_ambientValue = gl.getUniformLocation(gl.program, 'u_ambientValue');
    if (!u_ambientValue) {
        console.log('Failed to get the storage location of u_ambientValue');
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

    u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if(!u_NormalMatrix){
        console.log("Failed to get the storage location of u_NormalMatrix");
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

    program = {
    a_Position : gl.getAttribLocation(gl.program, 'a_Position'),
    u_whichTexture : gl.getUniformLocation(gl.program, 'u_whichTexture'),
    a_UV : gl.getAttribLocation(gl.program, 'a_UV'),
    a_Normal : gl.getAttribLocation(gl.program, 'a_Normal'),
    u_FragColor : gl.getUniformLocation(gl.program, 'u_FragColor'),
    u_lightPos : gl.getUniformLocation(gl.program, 'u_lightPos'),
    u_lightColor : gl.getUniformLocation(gl.program, 'u_lightColor'),
    u_activeLights : gl.getUniformLocation(gl.program, 'u_activeLights'),
    u_cameraPos : gl.getUniformLocation(gl.program, 'u_cameraPos'),
    u_specularValue : gl.getUniformLocation(gl.program, 'u_specularValue'),
    u_diffuseValue : gl.getUniformLocation(gl.program, 'u_diffuseValue'),
    u_ambientValue : gl.getUniformLocation(gl.program, 'u_ambientValue'),
    u_ModelMatrix : gl.getUniformLocation(gl.program, 'u_ModelMatrix'),
    u_GlobalRotateMatrix : gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix'),
    u_ViewMatrix : gl.getUniformLocation(gl.program, 'u_ViewMatrix'),
    u_ProjectionMatrix : gl.getUniformLocation(gl.program, 'u_ProjectionMatrix'),
    u_NormalMatrix : gl.getUniformLocation(gl.program, 'u_NormalMatrix'),
    u_Sampler0 : gl.getUniformLocation(gl.program, 'u_Sampler0'),
    u_Sampler1 : gl.getUniformLocation(gl.program, 'u_Sampler1'),
    u_Sampler2 : gl.getUniformLocation(gl.program, 'u_Sampler2'),
    u_Sampler3 : gl.getUniformLocation(gl.program, 'u_Sampler3'),
    u_Sampler4 : gl.getUniformLocation(gl.program, 'u_Sampler4'),
    u_Sampler5 : gl.getUniformLocation(gl.program, 'u_Sampler5'),
    u_Sampler6 : gl.getUniformLocation(gl.program, 'u_Sampler6'),
    };
}

//Globals related to UI elements
let g_globalAngle = 0;
let g_FOV = 90;
let g_placingTexture = 2;
let prebuild = false;
let g_normalOn = false;
let g_lightPos = [0,1,-2];
let g_lightPosMove = [0,0,0];
let g_specularValue = 32;
let g_diffuseValue = 5;
let g_ambientValue = 10;
let g_lightColor = [1.0,1.0,1.0];
let g_activeLights = true;
let g_lightAnimation = true;   

function addActionsForHtmlUI(){
    document.getElementById('normalOn').onclick = function(){g_normalOn = true;};
    document.getElementById('normalOff').onclick = function(){g_normalOn = false;};

    document.getElementById('lightOff').onclick = function(){g_activeLights = false;};
    document.getElementById('lightOn').onclick = function(){g_activeLights = true;};

    document.getElementById('lightMoveButton').addEventListener('click', function(){g_lightAnimation = !g_lightAnimation;})

    document.getElementById('houseButton').addEventListener('click', function(){prebuild = true;})
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderScene(); });
    document.getElementById('FOVSlide').addEventListener('mousemove', function() { g_FOV = this.value; renderScene(); });

    document.getElementById('lightSlideX').addEventListener('mousemove', function() { g_lightPosMove[0] = this.value/100; renderScene(); });
    document.getElementById('lightSlideY').addEventListener('mousemove', function() { g_lightPosMove[1] = this.value/100; renderScene(); });
    document.getElementById('lightSlideZ').addEventListener('mousemove', function() { g_lightPosMove[2] = this.value/100; renderScene(); });

    document.getElementById('specularSlide').addEventListener('mousemove', function() { g_specularValue = this.value; renderScene(); });
    document.getElementById('diffuseSlide').addEventListener('mousemove', function() { g_diffuseValue = this.value; renderScene(); });
    document.getElementById('ambientSlide').addEventListener('mousemove', function() { g_ambientValue = this.value; renderScene(); });

    document.getElementById("totalColor").addEventListener("input", function() {
        let color = this.value;
        let r = parseInt(color.slice(1,3), 16) / 255;
        let g = parseInt(color.slice(3,5), 16) / 255;
        let b = parseInt(color.slice(5,7), 16) / 255;
        g_lightColor = [r,g,b];
    });


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
    animateScene();
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
        cube.textureNum = g_normalOn ? -3 : placedCube.textureNum;
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
                cube.textureNum = g_normalOn ? -3 : 1;
                cube.matrix.setTranslate(0, 0, 0);
                cube.matrix.translate(x-16, -2, y-16);
                cube.renderfast()
            }
            if(g_map[x][y] == 1){
                cube.textureNum = g_normalOn ? -3 : 1;
                cube.matrix.setTranslate(0, 0, 0);
                cube.matrix.translate(x-16, -1, y-16);
                cube.renderfast()
            }
            if(g_map[x][y] >= 2){
                for(let i = 0; i < g_map[x][y]; i++){
                    if(g_map[x][y] == 32)
                        cube.textureNum = g_normalOn ? -3 : 3
                    if(g_map[x][y] < 32)
                        cube.textureNum = g_normalOn ? -3 : 1;
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
        cube.textureNum = g_normalOn ? -3 : block.textureNum;
        cube.matrix.setTranslate(Math.floor(block.position.elements[0]), Math.floor(block.position.elements[1]), Math.floor(block.position.elements[2]));
        cube.renderfast();
    }
}


function animateScene(){
    if(g_lightAnimation){
        g_lightPos[0] = Math.cos(g_seconds) * 5 + g_lightPosMove[0];
        g_lightPos[1] = Math.sin(g_seconds/2) * 2 + g_lightPosMove[1];
        g_lightPos[2] = Math.sin(g_seconds) * 5+ g_lightPosMove[2];
    }
    else{
        g_lightPos[0] = g_lightPosMove[0];
        g_lightPos[1] = g_lightPosMove[1];
        g_lightPos[2] = g_lightPosMove[2];
    }
}


let teapot = new Model("bunny.obj");
function renderScene(){
    var startTime = performance.now();

    var projMat = new Matrix4();
    projMat.setPerspective(g_FOV, canvas.width/canvas.height, 0.1, 2000);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2], 
        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2], 
        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]); //eye, at, up

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);

    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear([gl.COLOR_BUFFER_BIT]);

    gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);
    gl.uniform1f(u_specularValue, g_specularValue);
    gl.uniform1f(u_diffuseValue, g_diffuseValue);
    gl.uniform1f(u_ambientValue, g_ambientValue);
    gl.uniform1i(u_activeLights, g_activeLights);
    gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2])

    moveCamera();
    drawMap();
    drawPlacedCubes();
    
    if(prebuild)
        drawSaved();

    teapot.texture = -1;
    teapot.render(program);

    var light = new Cube();
    light.color = [20,20,0,1];
    light.textureNum = -2;
    light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    light.matrix.scale(-0.1,-0.1,-0.1);
    light.renderfast();

    var sky = new Cube();
    sky.textureNum = g_normalOn ? -3 : -2;
    sky.matrix.scale(-320.01,-320.01,-320.01);
    sky.matrix.translate(-0.5, -0.5, -0.5);
    sky.color = [0.05,0.1,0.25,1.0];
    sky.renderfast();

    var k = 8;
    for (var i =1; i < k; i++){
        var c = new Sphere();
        c.textureNum = g_normalOn ? -3: i;
        c.matrix.translate(0.8 * i/k*20, 0, 0);
        c.matrix.translate(-8,0,0);
        c.matrix.scale(0.5, 0.5, 0.5);
        c.render();
    }
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
