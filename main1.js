import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { light2, light3, light4 } from "./direct_light";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(light2);
scene.add(light3);
scene.add(light4);
const controls = new OrbitControls(camera, renderer.domElement);
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const loader = new GLTFLoader();
let currentVrm = undefined;
let currentMixer = undefined;

// Install GLTFLoader plugin
loader.register((parser) => {
  return new VRMLoaderPlugin(parser);
});

loader.load(
  // URL of the VRM you want to load
  "AliciaSolid_vrm-0.51.vrm",

  // called when the resource is loaded
  (gltf) => {
    // retrieve a VRM instance from gltf
    const vrm = gltf.userData.vrm;
    vrm.scene.position.set(0, -1, 0);
    // add the loaded vrm to the scene
    scene.add(vrm.scene);
    currentVrm = vrm;
    prepareAnimation(vrm);

    // deal with vrm features
    console.log(vrm);
  },

  // called while loading is progressing
  (progress) =>
    console.log(
      "Loading model...",
      100.0 * (progress.loaded / progress.total),
      "%"
    ),

  // called when loading has errors
  (error) => console.error(error)
);

function prepareAnimation(vrm) {
  currentMixer = new THREE.AnimationMixer(vrm.scene);

  const quatA = new THREE.Quaternion(0.0, 0.0, 0.0, 1.0);
  const quatB = new THREE.Quaternion(0.0, 0.0, 0.0, 1.0);
  quatB.setFromEuler(new THREE.Euler(0.0, 0.0, 0.1 * Math.PI));

  const armTrack = new THREE.QuaternionKeyframeTrack(
    vrm.humanoid.getNormalizedBoneNode("hips").name + ".quaternion", // name
    [0.0, 0.5, 1.0], // times
    [...quatA.toArray(), ...quatB.toArray(), ...quatA.toArray()] // values
  );

  const blinkTrack = new THREE.NumberKeyframeTrack(
    vrm.expressionManager.getExpressionTrackName("blink"), // name
    [0.0, 0.5, 1.0], // times
    [0.0, 1.0, 0.0] // values
  );

  const clip = new THREE.AnimationClip("Animation", 1.0, [
    //armTrack,
    blinkTrack,
  ]);
  const action = currentMixer.clipAction(clip);
  action.play();
}

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  const deltaTime = clock.getDelta();

  if (currentVrm) {
    currentVrm.update(deltaTime);
  }

  if (currentMixer) {
    currentMixer.update(deltaTime);
  }
  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();
