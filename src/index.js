import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import glbGlobo from '../assets/models/globo/scene.glb';
import gltfPokeball from '../assets/models/pokeball/scene.gltf';
import '../assets/models/pokeball/scene.bin';

let scene, camera, renderer, light;
let pokeball, globo;

(() => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  scene.add(camera);
  camera.position.z = 40;

  renderer = new THREE.WebGLRenderer({alpha: 1});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize);

  {
    light = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(light);
    light.position.z = 30;
  }

  {
    const loader = new GLTFLoader();
    loader.load(
      gltfPokeball,
      gltf => {
        pokeball = gltf.scene;
        scene.add(gltf.scene);
      },
      undefined,
      error => {
        console.log('Error: Pokeball', error);
      }
    );
  }

  {
    const loader = new GLTFLoader();
    loader.load(
      glbGlobo,
      gltf => {
        globo = gltf.scene;
        animate();
        scene.add(globo);
      },
      undefined,
      error => {
        console.log('Error: Globo', error);
      }
    );
  }

  animate();
  initEvents();
})();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function initEvents() {
  document.addEventListener(
    'wheel',
    e => {
      camera.zoom += 0.01;
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
