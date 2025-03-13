import * as THREE from "./three.js-master/src/Three.js";

import { OBJLoader } from "./three.js-master/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "./three.js-master/examples/jsm/controls/OrbitControls.js"

const canvas = document.getElementById("three-canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
	antialias: false,
	canvas: canvas
});
renderer.setSize(canvas.width, canvas.height);
renderer.setClearAlpha(0);





// instantiate a loader
// const loader = new OBJLoader();
// // load a resource
// loader.load(
// 	// resource URL
// 	'/ringworld1.obj',
// 	// called when resource is loaded
// 	function ( object ) {
// 		scene.add( object );
// 	},
// 	// called when loading is in progress
// 	function ( xhr ) {
// 		//console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
// 	},
// 	// called when loading has errors
// 	function ( error ) {
// 		console.log( 'An error happened' );
// 	}
// );





const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({
	color: 0x30c030,
	specular: 0xffffff,
	shininess: 50,
	shading: THREE.SmoothShading
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const torusgeometry = new THREE.TorusGeometry(1, 0.5, 64, 64, Math.PI * 2);
const torusmaterial = new THREE.MeshPhongMaterial({
	color: 0x007fff,
	specular: 0xffffff,
	shininess: 10,
	shading: THREE.SmoothShading
});
const torus = new THREE.Mesh(torusgeometry, torusmaterial);
scene.add(torus);

const light1 = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light1);
const light2 = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light2);



const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.15;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 1000;

function threeFrameLoop() {
	requestAnimationFrame(threeFrameLoop);

	controls.update(1 / 60);

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	//cube.position.x = -1.5;
	torus.position.z = -2;
	torus.position.x = 1.5;
	torus.rotation.x += 0.015;
	torus.rotation.y -= 0.011;
	renderer.render(scene, camera);
}

threeFrameLoop();



new ResizeObserver(() => {
	const ratio = window.devicePixelRatio;
	canvas.width = canvas.parentNode.clientWidth;
	canvas.height = canvas.parentNode.clientHeight - 36;
	renderer.setSize(canvas.width, canvas.height);
	renderer.setPixelRatio(ratio);

	//alert(window.devicePixelRatio);
	camera.aspect = canvas.width / canvas.height;
	camera.updateProjectionMatrix();

	renderer.render(scene, camera);
}).observe(canvas.parentNode);



export function why() {

}