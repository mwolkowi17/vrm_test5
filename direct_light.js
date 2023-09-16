import * as THREE from 'three';

const color = 0xFFFFFF;
const intensity = 0.3;
export const light2 = new THREE.DirectionalLight(color, intensity);
light2.position.set(0, 10, 10);
light2.target.position.set(-5, 0, 0);

export const light3 = new THREE.DirectionalLight(color, intensity);

light3.position.set(-3,-10,4);
light3.target.position.set(3,0,0);

export const light4 = new THREE.DirectionalLight(color, intensity)

light4.position.set(0,5,-10);
light4.target.position.set(5,0,0);

