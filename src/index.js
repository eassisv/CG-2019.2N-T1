import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import fbxGlobo from '../assets/models/globo/globo.fbx';
import fbxPokeball from '../assets/models/pokeball/pokeball.fbx';
import fbxGolbat from '../assets/models/golbat/golbat.fbx';
import fontGentilis from '../assets/fonts/gentilis_regular.typeface.json';

let scene, camera, renderer, light;
let pokeball, globo, group;
let golbats, zubats;
let flag = true;

const golbatsPositions = [
  [-60, 0, 220],
  [40, 0, 210],
  [140, 0, 200],
  [240, 0, 190],
  [-10, 45, 215],
  [90, 45, 205],
  [190, 45, 195],
  [-10, -45, 215],
  [90, -45, 205],
  [190, -45, 195],
  [-60, 45, 220],
  [40, 45, 210],
  [140, 45, 210],
  [240, 45, 190],
  [-60, -45, 220],
  [40, -45, 210],
  [140, -45, 200],
  [240, -45, 190],
  [-10, 0, 215],
  [90, 0, 205],
  [190, 0, 195]
];

(() => {
  console.log(fontGentilis);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 390;
  camera.position.x = -70;
  camera.rotation.y = -1.4;
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({alpha: 1});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize);

  golbats = new THREE.Group();
  // zubats = new THREE.Group();
  group = new THREE.Group();
  group.position.z = 200;
  group.rotation.y = 0.3;
  // scene.add(golbats);
  // scene.add(zubats);
  scene.add(group);
  setLight();
  loadPokeball();
  loadGlobo();
  loadGolbats();
  loadText();
  loadMusic();

  flag = true;
  initEvents();
  animate();
})();

function setLight() {
  light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(camera.position.x, camera.position.y, camera.position.z);
  const obj = new THREE.Object3D();
  obj.position.set(
    camera.position.x + 100,
    camera.position.y,
    camera.position.z - 25
  );
  obj.visible = false;
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.2);
  dirLight.position.set(0, 0, 900);
  dirLight.target = group;
  scene.add(dirLight, light, obj);
}

function loadText() {
  var loader = new THREE.FontLoader();
  loader.load('three/examples/fonts/helvetiker_regular.typeface.json', font => {
    console.log('font', font);
    var geometry = new THREE.TextBufferGeometry(
      'PLANTÃO',
      {
        font: font,
        size: 800,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      },
      undefined,
      error => {
        console.log('erro na font');
      }
    );
    scene.add(geometry);
  });
}

function loadGlobo() {
  const loader = new FBXLoader();
  loader.load(fbxGlobo, fbx => {
    globo = fbx;
    globo.scale.set(0.5, 0.5, 0.5);
    group.add(globo); //, new THREE.PointLight(0xbb00ff));
  });
}

function loadPokeball() {
  const loader = new FBXLoader();
  loader.load(
    fbxPokeball,
    fbx => {
      pokeball = fbx;
      pokeball.position.z = 40;
      group.add(pokeball);
    },
    undefined,
    error => {
      console.log(error);
    }
  );
}

function loadMusic() {
  var listener = new THREE.AudioListener();
  camera.add(listener);

  var sound = new THREE.Audio(listener);

  var audioLoader = new THREE.AudioLoader();
  audioLoader.load('assets/sounds/sound.ogg', function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });
  scene.add(audioLoader);
}

function loadGolbats() {
  const loader = new FBXLoader();
  loader.load(fbxGolbat, fbx => {
    golbatsPositions.forEach(pos => {
      const golbat = fbx.clone();
      golbat.scale.set(0.05, 0.05, 0.05);
      golbat.rotation.set(3.2, 0.5, 1.6);
      golbat.position.set(...pos);
      group.add(golbat);
    });

    group.add(golbats);
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function initEvents() {
  document.addEventListener(
    'wheel',
    e => {
      camera.zoom += e.deltaY * 0.01;
      camera.updateProjectionMatrix();
    },
    false
  );
}

function render() {
  if (flag && group.rotation.y > -1) {
    group.rotation.y -= 0.005;
  } else {
    flag = false;
    if (group.rotation.y < 0) group.rotation.y += 0.03;
    if (camera.rotation.y < 0) {
      camera.rotation.y += 0.02;
    }
    if (camera.position.z < 800) camera.position.z += 10;
    if (camera.position.x < 0) camera.position.x += 2;
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
  renderer.render(scene, camera);
}
