import * as THREE from 'three';
import { levelManager } from './level';
import './interface.tsx';
import { IHudWindow } from "./interface";
import EffectComposer from './lib/postprocessing/EffectComposer';
import RenderPass from './lib/postprocessing/RenderPass';
import ShaderPass from './lib/postprocessing/ShaderPass';
import {PixelLighting} from './lib/shaders/PixelLighting';
import {getAllSpritelights} from './components/spritelight';

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

//const shaderPass = new ShaderPass(PixelLighting);
//shaderPass.renderToScreen = true;
//effectComposer.addPass(shaderPass);

const render = () => {
    requestAnimationFrame(render);
    const delta = clock.getDelta();
    levelManager.update(delta);

    const cam = levelManager.currentLevel.currentCamera;

    // pacakge up the positions and colors for the spritelight shader
    // shaderPass.uniforms['resolution'].value = new THREE.Vector2(512, 512 * (window.innerHeight/window.innerWidth));
    // shaderPass.uniforms['cameraPos'].value = new THREE.Vector2(cam.parent.position.x, cam.parent.position.y);
    // shaderPass.uniforms['ambientLight'].value = new THREE.Vector3(0.4, 0.4, 0.4);
    // shaderPass.uniforms['lightCount'].value = 0;
    // shaderPass.uniforms['lightRadius'].value = Array<number>();
    // shaderPass.uniforms['lightPos'].value = Array<THREE.Vector3>();
    // shaderPass.uniforms['lightCol'].value = Array<THREE.Vector3>();
    // getAllSpritelights().forEach(light => {
    //     shaderPass.uniforms['lightCount'].value++;
    //     const col = light.data.color;
    //     shaderPass.uniforms['lightCol'].value.push(new THREE.Vector3(col[0], col[1], col[2]));

    //     const lightRelPos = light.owner.position.clone();
    //     lightRelPos.sub(cam.parent.position);
    //     lightRelPos.x /= 512;
    //     lightRelPos.y /= 512 * (window.innerHeight/window.innerWidth);
    //     lightRelPos.x += 0.5;
    //     lightRelPos.y += 0.5;
    //     shaderPass.uniforms['lightPos'].value.push(lightRelPos);
    //     shaderPass.uniforms['lightRadius'].value.push(light.data.radius);
    // });

    renderPass.camera = cam;
    effectComposer.render(delta);
};
render();
