import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Scene
const scene = new THREE.Scene();

// Create square
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x5cb8e4 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Create our sphere
const geometry = new THREE.SphereGeometry(1.5, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: 0x5cb8e4 });
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

// Ambient light (subtle overall illumination)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Color and intensity
scene.add(ambientLight);

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
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

renderer.setClearColor(0xf2f2f2);

renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.enableRotate = false; // Disable rotation with a mouse
controls.autoRotate = false;
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
let squareSide = 4;
let direction = "down";
let currentX = cube.position.x + squareSide;
let currentY = cube.position.y + squareSide;

const duration = 4000;
let startTime = performance.now();

const loop = () => {
  const elapsed = performance.now() - startTime;
  let ratio = elapsed / duration;
  let scaleForBreathing;

  // Update sphere position based on direction
  switch (direction) {
    case "right":
      document.querySelector(".command").textContent = "Hold";
      currentX = cube.position.x - squareSide + 2 * squareSide * ratio;
      if (currentX > cube.position.x + squareSide) {
        direction = "down";
        ratio = 0;
        startTime = performance.now();
      }
      break;
    case "down":
      document.querySelector(".command").textContent = "Exhale";
      scaleForBreathing = 1 - 0.5 * ratio;
      mesh.scale.set(scaleForBreathing, scaleForBreathing, scaleForBreathing);
      currentY = cube.position.y + squareSide - 2 * squareSide * ratio;
      if (currentY < cube.position.y - squareSide) {
        direction = "left";
        ratio = 0;
        startTime = performance.now();
      }
      break;
    case "left":
      document.querySelector(".command").textContent = "Hold";
      currentX = cube.position.x + squareSide - 2 * squareSide * ratio;
      if (currentX < cube.position.x - squareSide) {
        direction = "up";
        ratio = 0;
        startTime = performance.now();
      }
      break;
    case "up":
      document.querySelector(".command").textContent = "Inhale";
      scaleForBreathing = 0.5 + 0.5 * ratio;
      mesh.scale.set(scaleForBreathing, scaleForBreathing, scaleForBreathing);
      currentY = cube.position.y - squareSide + 2 * squareSide * ratio;
      if (currentY > cube.position.y + squareSide) {
        direction = "right";
        ratio = 0;
        startTime = performance.now();
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
