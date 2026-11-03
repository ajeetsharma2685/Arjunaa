
import * as THREE from 'three';

// ======================================
// ARJUNAA - FIRST OPEN WORLD PROTOTYPE
// ======================================

document.body.innerHTML = '';
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.background = '#87ceeb';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 100, 350);

const camera = new THREE.PerspectiveCamera(
  65, window.innerWidth / window.innerHeight, 0.1, 1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// LIGHTING
const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(-40, 80, 40);
sunlight.castShadow = true;
scene.add(sunlight);
scene.add(new THREE.HemisphereLight(0xffffff, 0x65734a, 1.5));

// MATERIALS
const grassMat = new THREE.MeshStandardMaterial({ color: 0x579447 });
const brownMat = new THREE.MeshStandardMaterial({ color: 0x79502d });

// BOX HELPER
function box(
  x: number, y: number, z: number,
  sx: number, sy: number, sz: number,
  color: number
) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(sx, sy, sz),
    new THREE.MeshStandardMaterial({ color })
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

// GROUND
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  grassMat
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// HIGHWAY
box(0, 0.04, 0, 12, 0.12, 420, 0x303238);

// ROAD MARKINGS
for (let z = -200; z < 210; z += 12) {
  box(0, 0.12, z, 0.25, 0.025, 6, 0xffffff);
}

box(-6.2, 0.15, 0, 0.35, 0.3, 420, 0xffffff);
box(6.2, 0.15, 0, 0.35, 0.3, 420, 0xffffff);

// VILLAGE HOUSES
function makeHouse(x: number, z: number, color: number) {
  box(x, 2, z, 9, 4, 8, color);
  box(x, 4.5, z, 10, 1, 9, 0x8c3828);
  box(x, 1, z - 4.06, 1.5, 2, 0.12, 0x57351f);
  box(x - 2.5, 2.5, z - 4.08, 1.4, 1.1, 0x83d5e8);
  box(x + 2.5, 2.5, z - 4.08, 1.4, 1.1, 0x83d5e8);
}

makeHouse(-19, -35, 0xe6c99b);
makeHouse(-35, -55, 0xd6b18a);
makeHouse(22, -45, 0xe8d4a5);
makeHouse(38, -70, 0xc8aa81);
makeHouse(-22, -90, 0xd9c39c);
makeHouse(25, -115, 0xe5c9a0);

// MODERN CITY
for (let i = 0; i < 14; i++) {
  const x = i % 2 === 0
    ? -25 - Math.random() * 30
    : 25 + Math.random() * 30;

  const z = 100 + Math.floor(i / 2) * 23;
  const height = 12 + Math.random() * 30;

  box(
    x, height / 2, z, 12, height, 12,
    [0x9daebd, 0x788d9e, 0xb5c6d3, 0x8a9caa][i % 4]
  );
}

// TREES
function makeTree(x: number, z: number) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.6, 4, 8),
    brownMat
  );
  trunk.position.set(x, 2, z);
  trunk.castShadow = true;
  scene.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x237a35 })
  );
  leaves.position.set(x, 5, z);
  leaves.castShadow = true;
  scene.add(leaves);
}

for (let z = -190; z < 190; z += 18) {
  makeTree(-13, z);
  makeTree(13, z);
}

// PLAYER CAR
const car = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 0.9, 5),
  new THREE.MeshStandardMaterial({
    color: 0xd92727,
    metalness: 0.25,
    roughness: 0.4
  })
);
body.position.y = 1;
body.castShadow = true;
car.add(body);

const cabin = new THREE.Mesh(
  new THREE.BoxGeometry(2.1, 0.9, 2.4),
  new THREE.MeshStandardMaterial({
    color: 0x9ed7e8,
    metalness: 0.2,
    roughness: 0.25
  })
);
cabin.position.set(0, 1.8, -0.3);
car.add(cabin);

// CAR WHEELS
for (const x of [-1.45, 1.45]) {
  for (const z of [-1.6, 1.6]) {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x151515 })
    );
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.55, z);
    car.add(wheel);
  }
}

car.position.set(0, 0, -10);
scene.add(car);

// KEYBOARD CONTROLS
const keys: Record<string, boolean> = {};

window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

// GAME HUD
const hud = document.createElement('div');

hud.innerHTML = `
  <div style="font-size:25px;font-weight:bold;letter-spacing:4px">
    ARJUNAA
  </div>
  <div style="font-size:12px;margin-top:5px">
    OPEN WORLD • PROTOTYPE 01
  </div>
  <div style="font-size:13px;margin-top:12px">
    WASD / ARROW KEYS - DRIVE
  </div>
`;

hud.style.cssText = `
  position:fixed;
  top:20px;
  left:20px;
  color:white;
  font-family:Arial;
  background:rgba(0,0,0,.55);
  padding:16px 20px;
  border-radius:10px;
  z-index:10;
  pointer-events:none;
`;

document.body.appendChild(hud);

// CAMERA
camera.position.set(0, 8, -22);
camera.lookAt(car.position);

// GAME ANIMATION
const clock = new THREE.Clock();
let speed = 0;

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  if (keys['w'] || keys['arrowup']) {
    speed = Math.min(speed + delta * 12, 25);
  } else if (keys['s'] || keys['arrowdown']) {
    speed = Math.max(speed - delta * 15, -10);
  } else {
    speed *= 0.97;
  }

  if (keys['a'] || keys['arrowleft']) {
    car.rotation.y += delta * 1.5;
  }

  if (keys['d'] || keys['arrowright']) {
    car.rotation.y -= delta * 1.5;
  }

  car.position.x -= Math.sin(car.rotation.y) * speed * delta;
  car.position.z -= Math.cos(car.rotation.y) * speed * delta;

  const targetCamera = new THREE.Vector3(
    car.position.x + Math.sin(car.rotation.y) * 12,
    car.position.y + 8,
    car.position.z + Math.cos(car.rotation.y) * 12
  );

  camera.position.lerp(targetCamera, 0.06);
  camera.lookAt(car.position.x, 1, car.position.z);

  renderer.render(scene, camera);
}

animate();

// RESPONSIVE SCREEN
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
