import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Scene
const scene = new THREE.Scene();

// Create square
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff83 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Create our sphere
const geometry = new THREE.SphereGeometry(1.5, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff83 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = 6;
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Light
const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
light.position.set(0, 10, 10);
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);

// renderer.setClearColor(0xcaf0f8);

renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
// controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Resize
window.addEventListener("resize", () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// Animation variables
let squareSide = 4; // Assuming the square has a side length of 4
let direction = "right";
let currentX = cube.position.x + squareSide;
let currentY = cube.position.y + squareSide;

const loop = () => {
  // Update sphere position based on direction
  switch (direction) {
    case "right":
      currentX += 0.03;
      if (currentX > cube.position.x + squareSide) {
        direction = "down";
        currentY -= 0.03;
      }
      break;
    case "down":
      currentY -= 0.03;
      if (currentY < cube.position.y - squareSide) {
        direction = "left";
        currentX -= 0.03;
      }
      break;
    case "left":
      currentX -= 0.03;
      if (currentX < cube.position.x - squareSide) {
        direction = "up";
        currentY += 0.03;
      }
      break;
    case "up":
      currentY += 0.03;
      if (currentY > cube.position.y + squareSide) {
        direction = "right";
        currentX += 0.03;
      }
      break;
  }

  // Update sphere position
  mesh.position.x = currentX;
  mesh.position.y = currentY;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();
