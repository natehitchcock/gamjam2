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
    speed: number;
    pattern: number;
}

export default class BulletLogic implements IComponent{
    bulletDirection: any;
    data: IBulletData; 
    bulletReference: Entity;

    constructor(data: IBulletData, owner: Entity) {
        this.data = data;
        this.bulletReference = owner; 
        const currentYPosition = mouse.yp;
        const currentXPosition = mouse.xp;
    };

    disappear(dt: number) {

    }

    movement(dt: number) {
        const speed = this.data.speed;
        const pattern = this.data.pattern;
        const direction = new THREE.Vector3();
       // direction.copy(this.bulletReference.position);

        const bulletPath = new THREE.Vector3(currentXPosition, currentYPosition);
       // var aimDirection = new THREE.Vector3(1).multiplyScalar;
        this.bulletReference.position.add(bulletPath);
        
   } ;

    update(dt) {
        this.movement(dt);
        return;
    }
}