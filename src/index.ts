import * as THREE from 'three';
import * as Howl from 'howler';
import Level from './level';
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
const camWidth = window.innerWidth/2;
const camHeight = window.innerHeight/2;
const camera = new THREE.OrthographicCamera(-camWidth, camWidth, camHeight, -   camHeight, -500, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const clock = new THREE.Clock();

camera.position.z = 299;

const uniforms = {
    color: {value: new THREE.Vector4(0, 1, 0, 1)},
};

const allEntities: Entity[] = [];

// spawning the weapon
const playerController = new PlayerController();

// node, as well as a child of the root
const playerdata = require('./toml/player.toml');

const wentity = new Entity(playerdata);
scene.add(wentity);
allEntities.push(wentity);

// spawning the weapon
const weapon = require('./toml/weapon.toml');

const wweapon = new Weapon(playerController, weapon, wentity);
scene.add(wweapon);
wweapon.position.x = 32;
wweapon.position.y = 32;
wentity.add(wweapon);

const testenemy = require('./toml/testenemy.toml');
const wother = new Entity(testenemy);
scene.add(wother);
wother.position.x = 100;
allEntities.push(wother);

const level = TerrainFactory.GeneratePerfectMaze(13, 26);
level.SpawnLevel();
level.position.copy(new THREE.Vector3(-350, -350));

scene.add(level);
scene.add(new THREE.DirectionalLight());
scene.add(new THREE.AmbientLight());

const direction = 1;

const startScreenData = require('./toml/startLevel.toml');
const startScreen = new Level(startScreenData);
startScreen.spawnEntities();
scene.add(startScreen);

const render = () => {
    requestAnimationFrame(render);
    const delta = clock.getDelta();
    startScreen.update(delta);


    wweapon.spawn(delta);
    wweapon.update(delta);

    allEntities.forEach(entity => {
        entity.update(delta);
    });

    renderer.render(scene, camera);
};

render();
