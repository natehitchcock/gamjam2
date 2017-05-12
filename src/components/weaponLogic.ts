import { IComponent } from "./component";
import Entity from "../entity";
import { mouse, keys } from "../lib/input";
import * as THREE from "three";
import Bullet from "../bullet";
import { levelManager, Level } from "../level";

interface IWeaponData {
  fireRate: number;
}

export default class WeaponLogic implements IComponent{
    data: IWeaponData;
    fireRate: number;
    bulletSpeed: number;
    realTime: number; 
    weaponReference: Entity;
    bulletsFired: Entity[];
    position: any;

    constructor(data: IWeaponData, owner: Entity) {
        this.data = data; 
        this.bulletsFired = [];
        this.fireRate = 0;
        this.weaponReference = owner;
    }

    spawn(dt: number) {
        this.fireRate += dt;
        if((mouse.left || keys[' ']) && this.fireRate > 0.5) {
            console.log("Entered Fire Statement.");
            const bullet = require('../toml/bullet.toml'); 
            //console.log(JSON.stringify(bullet));
            const firedBullet = new Entity(bullet);
            const newPosition = new THREE.Vector3();
            newPosition.copy(this.weaponReference.parent.position);
            levelManager.currentLevel.addEntity(firedBullet);
            this.bulletsFired.push(firedBullet);
            firedBullet.position.copy(newPosition);
            this.fireRate = 0;
        }
    }
    update(dt) {
        this.spawn(dt);
        this.bulletsFired.forEach((bulletsFired) => {
                bulletsFired.update(dt);
            });
        }
}