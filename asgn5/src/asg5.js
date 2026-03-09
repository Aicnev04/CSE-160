import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

async function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas, alpha: false});
    renderer.shadowMap.enabled = true;

    //Camera Settings
    const fov = 90;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;
    camera.position.y = 2;

    //Camera Controls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    //Scene
    const scene = new THREE.Scene();

    //GUI
    const gui = new GUI();
    let obj = {
        opacity: 1,
        Piano: async function() {
            const audio = document.getElementById("audioStream");

            audio.src = '../lib/LiebestraumNo3.mp3';

            if (audioContext.state === "suspended") {
                await audioContext.resume();
            }

            audio.play();
        },
        KZSC: async function() {
            const audio = document.getElementById("audioStream");

            audio.src = 'https://kzscfms1-geckohost.radioca.st/kzschigh';

            if (audioContext.state === "suspended") {
                await audioContext.resume();
            }

            audio.play();
        },
        loadFile: function() {
            document.getElementById('fileInput').click();
        },
        ViewNotesForGraders : function(){
            window.location.href = "https://github.com/Aicnev04/CSE-160/blob/main/asgn5/README.md";
        },
        visualize: false,
        waveform: false,
        toggleAmbientLight: false
        
    };

    gui.add(obj, 'ViewNotesForGraders').name('Notes For Graders');
    gui.add(obj, 'Piano');
    gui.add(obj, 'KZSC');
    gui.add(obj, 'loadFile').name('Load File');
    gui.add(obj, 'visualize');
    gui.add(obj, 'waveform');
    gui.add(obj, 'opacity', 0, 1);
    gui.add(obj, 'toggleAmbientLight');
    gui.add(obj, 'togglePointLight');
    gui.add(obj, 'toggleSpotLight');


    //Detects a new mp3/wav file for the audio visualizer
    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.name.split('.').pop().toLowerCase();
            if (fileType === 'mp3' || fileType === 'wav') {
                const audio = document.getElementById("audioStream");
                audio.src = URL.createObjectURL(file);
                if (audioContext.state === "suspended") {
                    audioContext.resume();
                }
                audio.play();
            } else {
                console.log('Incorrect file format');
            }
        }
    });

    //Background
    const bgLoader = new THREE.TextureLoader();
    const bgTexture = bgLoader.load('../lib/spaceSky.jpg', ()=>{
        bgTexture.mapping = THREE.EquirectangularReflectionMapping;
        bgTexture.colorSpace = THREE.SRGBColorSpace;
        bgTexture.magFilter = THREE.NearestFilter;
        bgTexture.minFilter = THREE.NearestFilter
    });
    bgTexture.colorSpace = THREE.SRGBColorSpace;


    //Sound Wave Cubes
    let cubes = [];
    const geometry = new THREE.BoxGeometry(1,1,1);

    function makeInstance(geometry, color, x){
        const material = new THREE.MeshBasicMaterial({color});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.x = x-200;
        cube.position.z = -10;
        //cube.scale.set(0.1,0.1,0.1);
        return cube;
    }

    for(let i = 0; i < 500; i++){
        cubes.push(makeInstance(geometry, 0x55FF55, i));
    }

    //Stage Floor
    const floorGeometry = new THREE.BoxGeometry(1,1,1)
    const floorLoader = new THREE.TextureLoader();
    const floorTexture = floorLoader.load('../lib/woodFloor.jpg', () =>{
        floorTexture.colorSpace = THREE.SRGBColorSpace;
        floorTexture.magFilter = THREE.NearestFilter;
    });
    const floorMaterial = new THREE.MeshPhongMaterial({
        map:floorTexture,
        opacity: 1.0,
        transparent: true,
        shininess: 100,
        specular:0xFFFFFF,
    })
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(5 ,5);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0,0,-5);
    floor.scale.set(24.001,1,10);
    scene.add(floor);


    //Concert Hall Walls
    const wall1Geometry = new THREE.BoxGeometry(1,1,1)
    const wall1Loader = new THREE.TextureLoader();
    const wall1Texture = wall1Loader.load('../lib/oakwall.jpg', () => {
        wall1Texture.colorSpace = THREE.SRGBColorSpace;
        wall1Texture.magFilter = THREE.NearestFilter;
        wall1Texture.minFilter = THREE.NearestFilter;
    });
    const wall1Material = new THREE.MeshPhongMaterial({
        map:wall1Texture,
        opacity: 1.0,
        transparent: true,
    })
    wall1Texture.wrapS = THREE.RepeatWrapping;
    wall1Texture.wrapT = THREE.RepeatWrapping;
    wall1Texture.repeat.set(4,2);
    const wall1 = new THREE.Mesh(wall1Geometry, wall1Material);
    wall1.position.set(0,2.5,-10);
    wall1.scale.set(17,5,0.5);
    scene.add(wall1);


    const wall2Geometry = new THREE.BoxGeometry(1,1,1)
    const wall2Loader = new THREE.TextureLoader();
    const wall2Texture = wall2Loader.load('../lib/oakWall.jpg', () => {
        wall2Texture.colorSpace = THREE.SRGBColorSpace;
        wall2Texture.magFilter = THREE.NearestFilter;
        wall2Texture.minFilter = THREE.NearestFilter;
    });
    const wall2Material = new THREE.MeshPhongMaterial({
        map:wall2Texture,
        opacity: 1.0,
        transparent: true,
    })
    wall2Texture.wrapS = THREE.RepeatWrapping;
    wall2Texture.wrapT = THREE.RepeatWrapping;
    wall2Texture.repeat.set(4,2);
    const wall2 = new THREE.Mesh(wall2Geometry, wall2Material);
    wall2.position.set(-10,2.5,-5);
    wall2.rotation.y = 1.3;
    wall2.scale.set(10,5,0.5);
    scene.add(wall2);


    const wall3Geometry = new THREE.BoxGeometry(1,1,1)
    const wall3Loader = new THREE.TextureLoader();
    const wall3Texture = wall3Loader.load('../lib/oakWall.jpg', () => {
        wall3Texture.colorSpace = THREE.SRGBColorSpace;
        wall3Texture.magFilter = THREE.NearestFilter;
        wall3Texture.minFilter = THREE.NearestFilter;
    });
    const wall3Material = new THREE.MeshPhongMaterial({
        map:wall3Texture,
        opacity: 1.0,
        transparent: true,
    })
    wall3Texture.wrapS = THREE.RepeatWrapping;
    wall3Texture.wrapT = THREE.RepeatWrapping;
    wall3Texture.repeat.set(4,2);
    const wall3 = new THREE.Mesh(wall3Geometry, wall3Material);
    wall3.position.set(10,2.5,-5);
    wall3.rotation.y = -1.3;
    wall3.scale.set(10,5,0.5);
    scene.add(wall3);
    const wall4Geometry = new THREE.BoxGeometry(1,1,1)
    const wall4Loader = new THREE.TextureLoader();
    const wall4Texture = wall4Loader.load('../lib/oakWall.jpg', () => {
        wall4Texture.colorSpace = THREE.SRGBColorSpace;
        wall4Texture.magFilter = THREE.NearestFilter;
        wall4Texture.minFilter = THREE.NearestFilter;
    });
    const wall4Material = new THREE.MeshPhongMaterial({
        map:wall4Texture,
        opacity: 1.0,
        transparent: true,
    })
    wall4Texture.wrapS = THREE.RepeatWrapping;
    wall4Texture.wrapT = THREE.RepeatWrapping;
    wall4Texture.repeat.set(6,4);
    const wall4 = new THREE.Mesh(wall4Geometry, wall4Material);
    wall4.position.set(11.3,2.3,11);
    wall4.scale.set(0.5,5.5,22.5)
    scene.add(wall4);
    const wall5Geometry = new THREE.BoxGeometry(1,1,1)
    const wall5Loader = new THREE.TextureLoader();
    const wall5Texture = wall5Loader.load('../lib/oakWall.jpg', () => {
        wall5Texture.colorSpace = THREE.SRGBColorSpace;
        wall5Texture.magFilter = THREE.NearestFilter;
        wall5Texture.minFilter = THREE.NearestFilter;
    });
    const wall5Material = new THREE.MeshPhongMaterial({
        map:wall5Texture,
        opacity: 1.0,
        transparent: true,
    })
    wall5Texture.wrapS = THREE.RepeatWrapping;
    wall5Texture.wrapT = THREE.RepeatWrapping;
    wall5Texture.repeat.set(6,4);
    const wall5 = new THREE.Mesh(wall5Geometry, wall5Material);
    wall5.position.set(-11.3,2.3,11);
    wall5.scale.set(0.5,5.5,22.5)
    scene.add(wall5);
    const wall6Geometry = new THREE.BoxGeometry(1,1,1)
    const wall6Loader = new THREE.TextureLoader();
    const wall6Texture = wall6Loader.load('../lib/oakwall.jpg', () => {
        wall6Texture.colorSpace = THREE.SRGBColorSpace;
        wall6Texture.magFilter = THREE.NearestFilter;
        wall6Texture.minFilter = THREE.NearestFilter;
    });
    const wall6Material = new THREE.MeshPhongMaterial({
        map:wall6Texture,
        opacity: 1.0,
        transparent: true,
    })
    wall6Texture.wrapS = THREE.RepeatWrapping;
    wall6Texture.wrapT = THREE.RepeatWrapping;
    wall6Texture.repeat.set(6,6);
    const wall6 = new THREE.Mesh(wall6Geometry, wall6Material);
    wall6.position.set(0,2.3,22);
    wall6.scale.set(22.5,5.5,0.5);
    scene.add(wall6);

    //Carpet Floor
    const carpetGeometry = new THREE.BoxGeometry(1,1,1);
    const carpetLoader = new THREE.TextureLoader();
    const carpetTexture = carpetLoader.load('../lib/carpet.jpg', () => {
        carpetTexture.colorSpace = THREE.SRGBColorSpace;
    }) 

    const carpetMaterial = new THREE.MeshPhongMaterial({
        map:carpetTexture,
        opacity: 1.0,
        transparent: true,
        shininess: 0
    })
    carpetTexture.wrapS = THREE.RepeatWrapping;
    carpetTexture.wrapT = THREE.RepeatWrapping;
    carpetTexture.repeat.set(4,4);
    const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
    carpet.receiveShadow = true;
    carpet.position.set(0,-0.5,10);
    carpet.scale.set(24,0.1,24);
    scene.add(carpet);

    //Earth Model
    const earthLoader = new OBJLoader();
    const earthTextureLoader = new THREE.TextureLoader();
    const earthTexture = await earthTextureLoader.loadAsync('../lib/Diffuse_2K.png')
    const earth = await earthLoader.loadAsync('../lib/Earth 2K.obj');

    earth.traverse((child) =>{
        if ( child.isMesh ) {
			 child.material.map = earthTexture;
			 child.geometry.computeVertexNormals();
		 }
    })
    earth.position.set(0,15,-20);
    earth.scale.set(1,1,1);
    scene.add(earth);

    
    //Piano Model
    let piano = null;
    const objLoader = new GLTFLoader();
    let gltf = objLoader.load('../lib/grand_piano/scene.gltf', (gltf) =>{
        piano = gltf.scene;
        piano.position.set(0,0.5 ,-4);
        scene.add(piano);
    });


    //Chair Models
    const chairTextureLoader = new THREE.TextureLoader();
    const chairMetallicLoader = new THREE.TextureLoader();
    const chairNormalLoader = new THREE.TextureLoader();
    const chairRoughnessLoader = new THREE.TextureLoader();
    const chairTexture = await chairTextureLoader.loadAsync('../lib/textures/metal_chair_BaseColor.png');
    const chairMetallic = await chairMetallicLoader.loadAsync('../lib/textures/metal_chair_Metallic.png');
    const chairNormal = await chairNormalLoader.loadAsync('../lib/textures/metal_chair_Normal.png');
    const chairRoughness = await chairRoughnessLoader.loadAsync('../lib/textures/metal_chair_Roughness.png');
    
    let chairs = [];
    async function makeChairInstance(x,z){
        const chairLoader = new FBXLoader();
        const chair = await chairLoader.loadAsync('../lib/metal chair.fbx');
        chair.traverse((child) =>{
        if ( child.isMesh ) {
             child.castShadow = true;
             child.receiveShadow = true;
			 child.material.map = chairTexture;
             child.material.metalnessMap = chairMetallic;
             child.material.normalMap = chairNormal;
             child.material.roughnessMap = chairRoughness;
			 child.geometry.computeVertexNormals();
            }
        })
        chair.scale.set(0.03,0.03,0.03);
        chair.position.set(-9+x,-0.45,3+z);
        scene.add(chair);
        return chair;
    }

    for(let i = 0; i < 19; i++){
        for(let j = 0; j < 18; j += 2){
            chairs.push(makeChairInstance(i,j));
        } 
    }

    //Stage Spot Lights
    {
        const color = 0xFFFFFF;
        const intensity = 150;
        const light = new THREE.SpotLight(color, intensity);
        light.castShadow = true;
        scene.add(light);
        scene.add(light.target);
        light.position.set(5, 5, -10);
        light.target.position.set(0, 0, -4);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 150;
        const light = new THREE.SpotLight(color, intensity);
        light.castShadow = true;
        scene.add(light);
        scene.add(light.target);
        light.position.set(-5, 5, -10);
        light.target.position.set(0, 0, -4);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 150;
        const light = new THREE.SpotLight(color, intensity);
        light.castShadow = true;
        scene.add(light);
        scene.add(light.target);
        light.position.set(0, 0, 0);
        light.target.position.set(0, 0, -4);
    }

    //Concert Wall Point Lights
    {
        const color = 0xFFFFFF;
        const intensity = 10;
        const light = new THREE.PointLight(color, intensity);
        light.castShadow = true;
        light.position.set(10,5,5);
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 10;
        const light = new THREE.PointLight(color, intensity);
        light.castShadow = true;
        light.position.set(10,5,15);
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 10;
        const light = new THREE.PointLight(color, intensity);
        light.castShadow = true;
        light.position.set(-10,5,5);
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 10;
        const light = new THREE.PointLight(color, intensity);
        light.castShadow = true;
        light.position.set(-10,5,15);
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 10;
        const light = new THREE.PointLight(color, intensity);
        light.castShadow = true;
        light.position.set(5,5,20);
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 10;
        const light = new THREE.PointLight(color, intensity);
        light.castShadow = true;
        light.position.set(-5,5,20);
        scene.add(light);
    }

    //Ambient Lighting
    const color = 0xFFFFFF;
    const intensity = 5;
    const ambientLight = new THREE.AmbientLight(color, intensity);

    scene.add(ambientLight);


    //Earth Spotlight
    const light = new THREE.SpotLight(0xFFFFFF, 150);
    scene.add(light);
    scene.add(light.target);
    light.position.set(0, 20, 0);



    //Connects the live audio from audio source
    const audio = document.getElementById("audioStream");
    const audioContext = new window.AudioContext();
    const source = audioContext.createMediaElementSource(audio);

    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2048;


    source.connect(analyzer);
    analyzer.connect(audioContext.destination);

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function render(time){
        time *= 0.001;


        scene.background = bgTexture;

        earth.position.x = Math.cos(time/2) * 25;
        earth.position.z = Math.sin(time/2) * 25;
        earth.rotation.y -= 0.05;

        light.target.position.x = earth.position.x;
        light.target.position.y = earth.position.y;
        light.target.position.z = earth.position.z;

        if(obj.toggleAmbientLight){
            ambientLight.visible = true;
        }
        else{
            ambientLight.visible = false;
        }

        floorMaterial.opacity = obj.opacity;
        carpetMaterial.opacity = obj.opacity;
        wall1Material.opacity= obj.opacity;
        wall2Material.opacity= obj.opacity;
        wall3Material.opacity= obj.opacity;
        wall4Material.opacity = obj.opacity
        wall5Material.opacity = obj.opacity;
        wall6Material.opacity = obj.opacity;

        if (piano) {
            piano.traverse((child) => {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = obj.opacity;
                }
            });
        }

        chairs.forEach((chair) => {
            chair.then((chair) => {
                chair.traverse((child) => {
                    if (child.isMesh) {
                        child.material.transparent = true;
                        child.material.opacity = obj.opacity;
                    }
                });
            });
        });

        
        if (earth) {
            earth.traverse((child) => {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = obj.opacity;
                }
            });
        }

        
        analyzer.getByteFrequencyData(dataArray);

        cubes.forEach((cube, ndx) =>{
            let value = dataArray[ndx];
            
            if(obj.waveform){
                if(obj.visualize){
                    if (!cube.targetPos || Math.random() < 0.02) {
                        cube.targetPos = {
                            x: (Math.random() - 0.5) * 1000,
                            y: (Math.random() - 0.5) * 1000,
                            z: (Math.random() - 0.5) * 1000
                        };
                    }

                    const lerpSpeed = 0.001;
                    cube.position.x += (cube.targetPos.x - cube.position.x) * lerpSpeed;
                    cube.position.y += (cube.targetPos.y - cube.position.y) * lerpSpeed;
                    cube.position.z += (cube.targetPos.z - cube.position.z) * lerpSpeed;
                }
                cube.scale.y = 1 + value/10;
                let hue = value / 255;
                cube.material.transparent = true;
                cube.material.opacity = value;
                cube.material.color.setHSL(hue, 1, 0.5);
            }
            else{
                cube.material.transparent = true;
                cube.material.opacity = 0;
            }
        })


        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();