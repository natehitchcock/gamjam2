import * as THREE from 'three';
import { levelManager } from './level';
import './interface';
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

levelManager.loadLevel('startlevel', true);

const effectComposer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, levelManager.currentLevel.currentCamera);
renderPass.renderToScreen = true;
effectComposer.addPass(renderPass);

const shaderPass = new ShaderPass(PixelLighting);
shaderPass.renderToScreen = false;
effectComposer.addPass(shaderPass);

const render = () => {
    requestAnimationFrame(render);
    const delta = clock.getDelta();
    levelManager.update(delta);

    const cam = levelManager.currentLevel.currentCamera;

    if(levelManager.currentLevel.data.usePixelShader === true) {
        renderPass.renderToScreen = false;
        shaderPass.renderToScreen = true;

        shaderPass.enabled = true;
    } else {
        renderPass.renderToScreen = true;
        shaderPass.renderToScreen = false;

        shaderPass.enabled = false;
    }

    // pacakge up the positions and colors for the spritelight shader
    const maxlc = 100;
    shaderPass.uniforms['resolution'].value = new THREE.Vector2(512, 512 * (window.innerHeight/window.innerWidth));
    shaderPass.uniforms['cameraPos'].value = new THREE.Vector2(cam.parent.position.x, cam.parent.position.y);
    shaderPass.uniforms['ambientLight'].value = new THREE.Vector3(0.0, 0.0, 0.0 );
    shaderPass.uniforms['lightCount'].value = 0;
    shaderPass.uniforms['time'].value = clock.getElapsedTime();
    shaderPass.uniforms['lightRadius'].value = Array<number>();
    shaderPass.uniforms['lightPos'].value = Array<THREE.Vector3>();
    shaderPass.uniforms['lightCol'].value = Array<THREE.Vector3>();
    shaderPass.uniforms['lightStyle'].value = Array<number>();
    getAllSpritelights().forEach(light => {
        shaderPass.uniforms['lightCount'].value++;
        const col = light.data.color;
        shaderPass.uniforms['lightCol'].value.push(new THREE.Vector3(col[0], col[1], col[2]));

        const lightRelPos = light.owner.position.clone();
        lightRelPos.sub(cam.parent.position);
        if(light.data.offset !== undefined) {
            lightRelPos.add(new THREE.Vector3(light.data.offset[0], light.data.offset[1], 0));
        }

        lightRelPos.x /= 512;
        lightRelPos.y /= 512 * (window.innerHeight/window.innerWidth);
        lightRelPos.x += 0.5;
        lightRelPos.y += 0.5;
        shaderPass.uniforms['lightPos'].value.push(lightRelPos);
        shaderPass.uniforms['lightRadius'].value.push(light.data.radius);

        shaderPass.uniforms['lightStyle'].value.push(light.data.style || 0);
    });

    for(let i = shaderPass.uniforms['lightCount'].value; i < maxlc; ++i) {
        shaderPass.uniforms['lightCol'].value.push(new THREE.Vector3(0, 0, 0));
        shaderPass.uniforms['lightPos'].value.push(new THREE.Vector3(0, 0, 0));
        shaderPass.uniforms['lightRadius'].value.push(0);
        shaderPass.uniforms['lightStyle'].value.push(0);
    }

    renderPass.camera = cam;
    effectComposer.render(delta);
};
render();
