import * as THREE from 'three';
import { PlayerController, IController } from './playercontroller';
import Entity from "./entity";
import Bullet from "./bullet";
import {keys, mouse} from './lib/input';

interface ICollisionData {
    blocks: boolean;
    radius: number;
}

export default class Weapon extends THREE.Object3D {
    controller: IController;
    collision: ICollisionData;
    data: any;
    playerReference: Entity;
    moveSpeed: number;
    bulletsFired: Bullet[];
    realTime: number;

    constructor(controller: IController, data: any, player: Entity) {
        super();
        this.data = data;
        this.controller = controller;
        this.playerReference = player;
        this.bulletsFired = [];
        this.realTime = 0;
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(data.image, (texture) => {
            const material = new THREE.MeshBasicMaterial( {map: texture, transparent: true} );
            const testCube = new THREE.Mesh(new THREE.CubeGeometry(25, 25, 25), material);
            this.add(testCube);
        });  
    }

    spawn(dt: number) {
          this.realTime += dt; 

          if(mouse.left && this.realTime > .5 ) {
            const bullet = require('./toml/weapon.toml');
            const firedBullet = new Bullet(undefined, bullet);
            const newPosition = new THREE.Vector3();
            newPosition.copy(this.playerReference.position);
            (window as any).scene.add(firedBullet);
            this.bulletsFired.push(firedBullet);
            firedBullet.position.copy(newPosition.add(this.position));
            console.log(firedBullet.position);
            this.realTime = 0;
        }
    }
    update(dt) {
        this.bulletsFired.forEach((bulletsFired) => {
            bulletsFired.update(dt);
        });
    }
}