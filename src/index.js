import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import fbxGlobo from '../assets/models/globo/globo.fbx';
import fbxPokeball from '../assets/models/pokeball/pokeball.fbx';
import fbxGolbat from '../assets/models/golbat/golbat.fbx';
import fbxZubat from '../assets/models/zubat/zubat.fbx';

let scene, camera, renderer, light;
let pokeball, globo, group;
let golbat, zubat;

(() => {
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

  group = new THREE.Group();
  group.position.z = 200;
  group.rotation.y = 0.3;
  scene.add(group);
  setLight();
  loadPokeball();
  loadGlobo();
  loadGolbats();
  loadZubats();


  initEvents();
  animate();
})();

function setLight() {
  light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 0, 900);
  light.target = group;
  scene.add(light);
}

function loadGlobo() {
  const loader = new FBXLoader();
  loader.load(fbxGlobo, fbx => {
    console.log('globo:', fbx);
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
      pokeball.position.z = 40
      group.add(pokeball);
    },
    undefined,
    error => {
      console.log(error);
    }
  );
}

const golbatsPositions = [[-60,0,220], [40, 0, 210], [140, 0, 200], [240, 0, 190]];
function loadGolbats() {
  const loader = new FBXLoader();
  loader.load(fbxGolbat, fbx => {
    golbat = fbx;
    golbat.scale.set(0.05, 0.05, 0.05);
    golbat.rotation.set(3.2, 0.5, 1.6);

    golbat.position.set(-60, 0, 220);

    group.add(golbat);
  });
}

const zubatPositions = [[-60, 45, 215],[-60, -45, 225], [-10, 0, 215], [90, 0, 205], [190, 0, 195] ];
function loadZubats() {
  const loader = new FBXLoader();
  loader.load(fbxZubat, fbx => {
    zubat = fbx;
    zubat.scale.set(0.05, 0.05, 0.05);
    zubat.rotation.set(3.2, 0.5, 1.6);

    zubat.position.set(-60, -45, 215);

    group.add(zubat);
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
  // group.rotation.y -= 0.05;
}

function animate() {
  requestAnimationFrame(animate);
  render();
  renderer.render(scene, camera);
}
