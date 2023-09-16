import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
//import { light2, light3, light4 } from "./direct_light";


let stear = false;

//stop_start_buttons
const actionbutton = document.getElementById("start_button");
actionbutton.addEventListener("click", function () {
 console.log('clicked');
 stear = true;
 //setTimeout(()=>{stear=false},2000)
  })

const stopbutton = document.getElementById("stop_button");
stopbutton.addEventListener('click',function(){
  console.log('stop')
  stear = stop
})

//mouth expression colection
const mouths=['aa','ee','ih','oh','ou']
let mouthselected = mouths[0]

//mounth expression type controll handlers
// const aabutton = document.getElementById('aa_button')
// aabutton.addEventListener('click',function(){
//   console.log(mouths[0])
//   mouthselected = mouths[0]
// })
// const eebutton = document.getElementById('ee_button')
// eebutton.addEventListener('click',function(){
//   console.log(mouths[1])
//   mouthselected = mouths[1]
// })
// const ihbutton = document.getElementById('ih_button')
// ihbutton.addEventListener('click',function(){
//   console.log(mouths[2])
//   mouthselected = mouths[2]
// })
// const ohbutton = document.getElementById('oh_button')
// ohbutton.addEventListener('click',function(){
//   console.log(mouths[3])
//   mouthselected = mouths[3]
// })
// const oubutton = document.getElementById('ou_button')
// oubutton.addEventListener('click',function(){
//   console.log(mouths[4])
//   mouthselected = mouths[4]
// })

//face expressions collection

const facecollection =['angry','happy','neutral','sad'];
let currentface =facecollection[2];

const normalbutton = document.getElementById('normal_button');
normalbutton.addEventListener('click',()=>{
  console.log('normal');
  currentface=facecollection[2];
})

const angrybutton = document.getElementById('angry_button');
angrybutton.addEventListener('click',()=>{
  console.log('angry');
  currentface=facecollection[0];
})

const happybutton = document.getElementById('happy_button');
happybutton.addEventListener('click',()=>{
  console.log('happy');
  currentface=facecollection[1];
})

const sadbutton = document.getElementById('sad_button');
sadbutton.addEventListener('click',()=>{
  console.log('sad');
  currentface=facecollection[3];
})

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

// camera
const camera = new THREE.PerspectiveCamera( 30.0, window.innerWidth / window.innerHeight, 0.1, 20.0 );
camera.position.set( 0.0, 1.5, 1.0 );
//camera.target.

// camera controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.screenSpacePanning = true;
controls.target.set( 0.0, 1.3, 0.0 );
controls.update();

// scene
const scene = new THREE.Scene();

// light
const light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 1.0, 1.0, 1.0 ).normalize();
scene.add( light );

// gltf and vrm
let currentVrm = undefined;
const loader = new GLTFLoader();
loader.crossOrigin = 'anonymous';

loader.register( ( parser ) => {

  return new VRMLoaderPlugin( parser );

} );

loader.load(

  'AliciaSolid_vrm-0.51.vrm',

  ( gltf ) => {

    const vrm = gltf.userData.vrm;

    // calling these functions greatly improves the performance
    VRMUtils.removeUnnecessaryVertices( gltf.scene );
    VRMUtils.removeUnnecessaryJoints( gltf.scene );

    // Disable frustum culling
    vrm.scene.traverse( ( obj ) => {

      obj.frustumCulled = false;

    } );
    gltf.scene.rotation.y=Math.PI
    scene.add( vrm.scene );
    currentVrm = vrm;

    console.log( vrm );
    //console.log(Math.PI)

  },

  ( progress ) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),

  ( error ) => console.error( error )

);

// helpers
const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// animate
const clock = new THREE.Clock();

function animate() {

  requestAnimationFrame( animate );

  const deltaTime = clock.getDelta();

  if ( currentVrm ) {

    // tweak expressions
    const s = Math.sin( Math.PI * clock.elapsedTime );
    //currentVrm.expressionManager.setValue( 'blinkLeft', 0.5 - 0.5 * s );
    if(stear===true){
      
      currentVrm.expressionManager.setValue( mouthselected, 0.1 + 0.5 * s );
      
    }
    currentVrm.expressionManager.setValue(currentface, 0.5 - 0.5 * s)

    // update vrm
    currentVrm.update( deltaTime );

  }
  
  renderer.render( scene, camera );

}

animate();

// const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// camera.position.z = 2;

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// scene.add(light2);
// scene.add(light3);
// scene.add(light4);
// const controls = new OrbitControls(camera, renderer.domElement);
// window.addEventListener("resize", onWindowResize, false);
// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   render();
// }

// const loader = new GLTFLoader();
// let currentVrm = undefined;
// let currentMixer = undefined;

// // Install GLTFLoader plugin
// loader.register((parser) => {
//   return new VRMLoaderPlugin(parser);
// });

// loader.load(
//   // URL of the VRM you want to load
//   "AliciaSolid_vrm-0.51.vrm",

//   // called when the resource is loaded
//   (gltf) => {
//     // retrieve a VRM instance from gltf
//     const vrm = gltf.userData.vrm;
//     vrm.scene.position.set(0, -1, 0);
//     // add the loaded vrm to the scene
//     scene.add(vrm.scene);
//     currentVrm = vrm;
//     prepareAnimation(vrm);

//     // deal with vrm features
//     console.log(vrm);
//   },

//   // called while loading is progressing
//   (progress) =>
//     console.log(
//       "Loading model...",
//       100.0 * (progress.loaded / progress.total),
//       "%"
//     ),

//   // called when loading has errors
//   (error) => console.error(error)
// );

// function prepareAnimation(vrm) {
//   currentMixer = new THREE.AnimationMixer(vrm.scene);

//   const quatA = new THREE.Quaternion(0.0, 0.0, 0.0, 1.0);
//   const quatB = new THREE.Quaternion(0.0, 0.0, 0.0, 1.0);
//   quatB.setFromEuler(new THREE.Euler(0.0, 0.0, 0.1 * Math.PI));

//   const armTrack = new THREE.QuaternionKeyframeTrack(
//     vrm.humanoid.getNormalizedBoneNode("hips").name + ".quaternion", // name
//     [0.0, 0.5, 1.0], // times
//     [...quatA.toArray(), ...quatB.toArray(), ...quatA.toArray()] // values
//   );

//   const blinkTrack = new THREE.NumberKeyframeTrack(
//     vrm.expressionManager.getExpressionTrackName("blink"), // name
//     [0.0, 0.5, 1.0], // times
//     [0.0, 1.0, 0.0] // values
//   );

//   const clip = new THREE.AnimationClip("Animation", 1.0, [
//     //armTrack,
//     blinkTrack,
//   ]);
//   const action = currentMixer.clipAction(clip);
//   action.play();
// }

// const clock = new THREE.Clock();
// function animate() {
//   requestAnimationFrame(animate);
//   controls.update();

//   const deltaTime = clock.getDelta();

//   if (currentVrm) {
//     currentVrm.update(deltaTime);
//   }

//   if (currentMixer) {
//     currentMixer.update(deltaTime);
//   }
//   render();
// }

// function render() {
//   renderer.render(scene, camera);
// }

// animate();
