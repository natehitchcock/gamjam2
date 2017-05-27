import * as THREE from 'three';
import { levelManager } from './level';
import './interface.tsx';
import { IHudWindow } from "./interface";
import EffectComposer from './lib/postprocessing/EffectComposer';
import RenderPass from './lib/postprocessing/RenderPass';

interface IGameWindow extends Window {
    scene: THREE.Scene;
}

declare const window: IGameWindow;
const scene = new THREE.Scene();

window.scene = scene;


/*////////////////////////////////// Hud
var hudCanvas = document.createElement('canvas');

hudCanvas.width = innerWidth;
hudCanvas.height = innerHeight;

var hudBitmap = hudCanvas.getContext('2d');
hudBitmap.font = "Normal 40px Arial";
hudBitmap.textAlign = 'center';
hudBitmap.fillStyle = "rgba(245, 245, 245, 0.75)";
hudBitmap.fillText('HUD Attempt #1...', innerWidth / 2, innerHeight / 2);

var cameraHUD = new THREE.OrthographicCamera(-innerWidth / 2, innerWidth / 2, innerHeight / 2, -innerHeight / 2, 0, 30)

var sceneHUD = new THREE.Scene();

var hudTexture = new THREE.Texture(hudCanvas)
hudTexture.needsUpdate = true;

var material = new THREE.MeshBasicMaterial({ map: hudTexture });
material.transparent = true;

var planeGeometry = new THREE.PlaneGeometry(innerWidth, innerHeight);
var plane = new THREE.Mesh(planeGeometry, material);
sceneHUD.add(plane);
/////////////////*/

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();

levelManager.init(scene);
const startlevelData = require('./toml/startlevel.toml');
levelManager.addLevel('startlevel', startlevelData);
const theRoomData = require('./toml/theRoom.toml');
levelManager.addLevel('theRoom', theRoomData);
const testcavelevelData = require('./toml/testcavelevel.toml');
levelManager.addLevel('testcavelevel', testcavelevelData);

levelManager.loadLevel('startlevel');

const effectComposer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, levelManager.currentLevel.currentCamera);
renderPass.renderToScreen = true;
effectComposer.addPass(renderPass);

const render = () => {
    requestAnimationFrame(render);
    const delta = clock.getDelta();
    levelManager.update(delta);

    renderPass.camera = levelManager.currentLevel.currentCamera;
    effectComposer.render(delta);
};
render();
