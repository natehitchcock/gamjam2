import * as THREE from 'three';
import { PlayerController, IController } from './playercontroller';
import Entity from "./entity";
import Bullet from "./bullet";

interface ICollisionData {
    blocks: boolean;
    radius: number;
}

export default class Weapon extends THREE.Object3D {
    controller: IController;
    collision: ICollisionData;
    data: any;
    
    moveSpeed: number;

    constructor(controller: IController, data: any) {
        super();
        this.data = data;
        this.controller = controller;
       
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(data.image, (texture) => {
            const material = new THREE.MeshBasicMaterial( {map: texture, transparent: true} );
            const testCube = new THREE.Mesh(new THREE.CubeGeometry(25, 25, 25), material);
            this.add(testCube);
        });  
    }

    spawn() {
        if(this.controller.GetWeaponFire().length() >= 1) {
            const bullet = require('./toml/weapon.toml');
            const firedBullet = new Bullet(undefined, bullet);
            (window as any).scene.add(firedBullet);
        }
    }
}