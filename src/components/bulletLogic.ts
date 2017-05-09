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
        const speed = require('./toml/weapon.toml');
        const pattern = require('./toml/weapon.toml');
        const direction = new THREE.Vector3();
        direction.copy(this.weaponReference.position);
        
        direction.add(
        if(weapon.fired) direction.add(Mouse.THREE.Vector3(x, y, z) += speed; 
        if(weapon.fired) direction.y -= speed; 
        if(weapon.fired) direction.x += speed;
        if(weapon.fired) direction.x -= speed; 
Weapon.spawn
   } 
    
    update(dt: number) {
        return;
    }
}