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
    bulletToml: any;
    bulletsFired: Entity[];
    position: any;

    constructor(data: IWeaponData, owner: Entity) {
        this.data = data;
        this.bulletsFired = [];
        this.fireRate = 0;
        this.owner = owner;
        this.bulletToml = require('../toml/bullet.toml');
    }

    initialize() {
        this.owner.addEventListener('fire', this.tryFire.bind(this));
    }

    destroy() {
        return;
    }

    tryFire(dir: THREE.Vector2) {
        console.log('woop');
        if(this.fireRate > 0.5) {
            console.log('spawn');
            // spawning bullet
            const firedBullet = new Entity(this.bulletToml);
            firedBullet.sharedData.mousePositions = (dir !== undefined ?
                                                     dir :
                                                     new THREE.Vector2(mouse.mouse.xp, mouse.mouse.yp).normalize());
            firedBullet.sharedData.sender = this.owner.parent;
            console.log('spawn ' + JSON.stringify(this.bulletToml));

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
        this.fireRate += dt;
    }
}
