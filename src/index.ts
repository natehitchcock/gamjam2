import * as THREE from 'three';
import * as Howl from 'howler';
import {Level, LevelFactory} from './level';
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


const playerController = new PlayerController();


//node, as well as a child of the root
const playerdata = require('./toml/player.toml');
const wentity = new Entity(playerController, playerdata);
scene.add(wentity);
allEntities.push(wentity);

//spawning the weapon
const weapon = require('./toml/weapon.toml');

const wweapon = new Weapon(playerController, weapon, wentity);
scene.add(wweapon);
wweapon.position.x = 32;
wweapon.position.y = 32;
wentity.add(wweapon);

const wother = new Entity(undefined, playerdata);
wother.position.x = 100;
scene.add(wother);
allEntities.push(wother);

const level = LevelFactory.GeneratePerfectMaze(10,10);
level.SpawnLevel();
level.position.copy(new THREE.Vector3(-350, -350));

scene.add(level);
scene.add(new THREE.DirectionalLight());
scene.add(new THREE.AmbientLight());

const direction = 1;

var realTime = 0; 


const render = () => {
    requestAnimationFrame(render);
    const delta = clock.getDelta();

    realTime += delta;

    wweapon.spawn(delta);
    wweapon.update(delta);

    allEntities.forEach(entity => {
        entity.update(delta);

        allEntities.forEach(other => {
            if(other === entity) {
                return;
            }
    
            const collisionData = entity.IsCollidingWith(other);
            if(collisionData.isColliding === true) {
                entity.HandleCollision(other);
                other.HandleCollision(entity);

                if(entity.collision.blocks && other.collision.blocks) {
                    const sumRadius = entity.collision.radius + other.collision.radius;
                    const deltaVec = new THREE.Vector3().copy(entity.position).sub(other.position);
                    const entityResolve = new THREE.Vector3()
                        .copy(deltaVec)
                        .normalize()
                        .multiplyScalar(collisionData.overlap/2);
                    const otherResolve = new THREE.Vector3()
                        .copy(deltaVec)
                        .normalize()
                        .multiplyScalar(-collisionData.overlap/2);
                    entity.position.copy(entityResolve.add(entity.position));
                    other.position.copy(otherResolve.add(other.position));
                }
            }
        });
    });

    renderer.render(scene, camera);
};

render();
