import Collider from './collider';
import Sprite from './sprite';
import { IComponent } from "./component";
import Entity from "../entity";
import * as THREE from "@types/three";

interface IBulletData {
    damageMultiplier: number;
    bulletLife: number;
}

export default class BulletLogic implements IComponent{
    data: IBulletData; 
    weaponReference: Entity;

    constructor(data: IBulletData, owner: Entity) {
        this.data = data;
        this.weaponReference = owner; 
    };

    disappear(dt: number) {

    }

    movement(dt: number) {
        const direction = new THREE.Vector3();
        const speed = require('./toml/weapon.toml');
        const pattern = require('./toml/weapon.toml');

        direction.copy(this.weaponReference.position);




   } 
    
    update(dt: number) {
        return;
    }
}