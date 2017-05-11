import Collider from './collider';
import Sprite from './sprite';
import { IComponent } from "./component";
import Entity from "../entity";
import * as THREE from "three";
import Weapon from "../weapon";
import { mouse } from "../lib/input";

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
        const speed = require('../toml/weapon.toml');
        const pattern = require('../toml/weapon.toml');
        const direction = new THREE.Vector3();
        direction.copy(this.weaponReference.position);
        const currentXPosition = mouse.xp;
        const currentYPosition = mouse.yp;
        var aimDirection = new THREE.Vector3(mouse.xp, mouse.yp);
        
   } ;

    update(dt: number) {
        return;
    }
}