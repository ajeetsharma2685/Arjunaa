import * as THREE from 'three';
import data from './data.json';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe:false });
const cube = new THREE.Mesh(geometry, material);
const edges = new THREE.EdgesGeometry( geometry );
const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xff0000 } ) );
cube.add(line);
scene.add(cube);
// console.log(geometry.getAttribute('position'));
camera.position.z = 5;

const animate = function () {
  requestAnimationFrame(animate);

  //cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();
console.log(data)
// Promise.resolve(jj)
// .then(res=>res)
// .then((resp)=>{
// console.log(resp)
// })

/*
front
x,y,z([0][0][0])__________x,y,z[1][0][0]
|
|
|
x,y,z[0][1][0]__________x,y,z[1][1][0]

*/

/*
back face
x,y,z([0][0][1])__________x,y,z[1][0][1]
|
|
|
x,y,z[0][1][1]__________x,y,z[1][1][1]
*/

/*
top
x,y,z([0][0][0])__________x,y,z[1][0][0]
|
|
|
x,y,z([0][0][1])__________x,y,z[1][0][1]

*/

/*
bottom
x,y,z[0][1][1]__________x,y,z[1][1][1]
|
|
|
x,y,z[0][1][0]__________x,y,z[1][1][0]

*/