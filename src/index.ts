import * as THREE from 'three';
import * as Howl from 'howler';
import {levelManager} from './level';
import {Terrain, TerrainFactory} from './terrain';
import Entity from './entity';
import {PlayerController} from './playercontroller';
import Weapon from './weapon';
import Bullet from './bullet';
import {keys, mouse} from './lib/input';

interface IGameWindow extends Window {
    scene: THREE.Scene;
}

declare const window: IGameWindow;
const scene = new THREE.Scene();

window.scene = scene;


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const clock = new THREE.Clock();

levelManager.init(scene);
const startlevelData = require('./toml/startlevel.toml');
levelManager.addLevel('startlevel', startlevelData);
const testlevelData = require('./toml/testlevel.toml');
levelManager.addLevel('testlevel', testlevelData);
levelManager.loadLevel('startlevel');

const render = () => {
    requestAnimationFrame(render);
    const delta = clock.getDelta();

    levelManager.update(delta);

    renderer.render(scene, levelManager.currentLevel.currentCamera);
};

render();
