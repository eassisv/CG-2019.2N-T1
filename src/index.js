import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {TGALoader} from 'three/examples/jsm/loaders/TGALoader';
import glbGlobo from '../assets/models/globo/scene.glb';
import fbxPokeball from '../assets/models/pokeball-fbx/pokeball.fbx';

let scene, camera, renderer, light;
let pokeball, globo, group;

(() => {
  THREE.Loader.Handlers.add(/\.tga$/i, new TGALoader());

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 900;
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({alpha: 1});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize);

  group = new THREE.Group();
  scene.add(group);
  setLight();
  loadPokeball();
  // loadGlobo();

  initEvents();
  animate();
})();

function setLight() {
  light = new THREE.DirectionalLight(0xffffff, 2.5);
  light.position.set(camera.position.x, camera.position.y, camera.position.z);
  light.target = group;
  scene.add(light);
}

function loadGlobo() {
  const loader = new GLTFLoader();
  loader.load(glbGlobo, gltf => {
    console.log('globo:', gltf);
    globo = gltf.scene;
    globo.scale.set(10, 10, 10);
    group.add(globo, new THREE.PointLight(0xbb00ff));
  });
}

function loadPokeball() {
  const loader = new FBXLoader();
  loader.load(fbxPokeball, fbx => {
    pokeball = fbx;
    console.log('pokeball:', pokeball);
    // pokeball.scale.set(0.05, 0.05, 0.05);
    group.add(pokeball);
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

function render() {}

function animate() {
  requestAnimationFrame(animate);
  render();
  renderer.render(scene, camera);
}
