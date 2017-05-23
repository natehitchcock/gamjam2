import { IComponent } from "./component";
import Entity from "../entity";
import { mouse, keyboard } from "../lib/input";
import * as THREE from "three";
import { levelManager, Level } from "../level";

interface IWeaponData {
  fireRate: number;
}

export default class WeaponLogic implements IComponent {
    data: IWeaponData;
    fireRate: number;
    bulletSpeed: number;
    realTime: number;
    owner: Entity;
    bulletsFired: Entity[];
    position: any;

    constructor(data: IWeaponData, owner: Entity) {
        this.data = data;
        this.bulletsFired = [];
        this.fireRate = 0;
        this.owner = owner;
    }
    destroy(){
        
    }

    spawn(dt: number) {
        this.fireRate += dt;
        if((mouse.mouse.left || keyboard.rawKeys['space']) && this.fireRate > 0.5) {
            // spawning bullet
            const bullet = require('../toml/bullet.toml');
            const firedBullet = new Entity(bullet);
            firedBullet.sharedData.mousePositions = new THREE.Vector3(mouse.mouse.xp, mouse.mouse.yp).normalize();
            firedBullet.sharedData.sender = this.owner.parent;

            // setting position
            const newPosition = new THREE.Vector3();
            newPosition.copy(this.owner.parent.position);
            newPosition.add(this.owner.position);

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