import * as THREE from './three.js-master/build/three.module.js';
import {FBXLoader} from './three.js-master/examples/jsm/loaders/FBXLoader.js';

let scene, camera, renderer, light;
let pokeball, globo, group;
let golbats = [];
let flag = true;

const golbatsPositions = [
  [-60, 0, 220],
  [-60, 45, 220],
  [-60, -45, 220],
  [-10, 45, 215],
  [-10, -45, 215],
  [-10, 0, 215],
  [40, 0, 210],
  [40, 45, 210],
  [40, -45, 210],
  [90, 45, 205],
  [90, -45, 205],
  [90, 0, 205],
  [140, 0, 190],
  [140, 45, 190],
  [140, -45, 190],
  [190, 0, 180],
  [190, -45, 180],
  [190, 45, 180],
  [240, 45, 160],
  [240, 0, 160],
  [240, -45, 160]
];

(() => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  initCameraPosition();
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({alpha: 1});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize);

  group = new THREE.Group();
  initGroupPosition();
  scene.add(group);
  setLight();
  loadPokeball();
  loadGlobo();
  loadText();
  loadGolbats();

  flag = true;
  initEvents();
})();

function initCameraPosition() {
  camera.position.z = 390;
  camera.position.x = -70;
  camera.rotation.y = -1.4;
}

function initGroupPosition() {
  group.position.z = 200;
  group.rotation.y = 0.3;
}

function reinitGolbats() {
  golbats.forEach(golbat => {
    golbat.visible = true;
  });
}

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

function loadSound() {
  const listener = new THREE.AudioListener();

  const sound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('./assets/sounds/sound.ogg', function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(1);
    sound.play();
  });
}

function loadText() {
  const loader = new THREE.FontLoader();
  loader.load(
    './three.js-master/examples/fonts/helvetiker_regular.typeface.json',
    font => {
      console.log('font', font);
      const geometry = new THREE.TextBufferGeometry('POKETAO', {
        font: font,
        size: 120,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      });
      const material = new THREE.MeshPhongMaterial({color: 0xf7f7f7});
      const text = new THREE.Mesh(geometry, material);
      text.position.set(-280, 210, 200);
      text.rotation.y = 0.4;
      scene.add(text);
    }
  );
}

function loadGlobo() {
  const loader = new FBXLoader();
  loader.load('./assets/models/globo/globo.fbx', fbx => {
    globo = fbx;
    globo.scale.set(0.5, 0.5, 0.5);
    group.add(globo);
  });
}

function loadPokeball() {
  const loader = new FBXLoader();
  loader.load('./assets/models/pokeball/pokeball.fbx', fbx => {
    pokeball = fbx;
    pokeball.position.z = 40;
    group.add(pokeball);
  });
}

function loadGolbats() {
  const loader = new FBXLoader();
  loader.load('./assets/models/golbat/golbat.fbx', fbx => {
    golbatsPositions.forEach(pos => {
      const golbat = fbx.clone();
      golbat.scale.set(0.05, 0.05, 0.05);
      golbat.rotation.set(3.2, 0.5, 1.6);
      golbat.position.set(...pos);
      group.add(golbat);
      golbats.push(golbat);
    });
  });
  loadSound();
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function reinit() {
  flag = true;
  initCameraPosition();
  initGroupPosition();
  reinitGolbats();
  loadSound();
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
  document.addEventListener('keypress', e => {
    if (e.key === 'r') {
      reinit();
    }
  });
}

function render() {
  if (flag && group.rotation.y > -1) {
    group.rotation.y -= 0.004;
  } else {
    flag = false;

    golbats.forEach(child => {
      child.visible = false;
    });
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
