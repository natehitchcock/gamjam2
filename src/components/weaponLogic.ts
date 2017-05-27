import { IComponent } from "./component";
import Entity from "../entity";
import { mouse, keyboard } from "../lib/input";
import * as THREE from "three";
import { levelManager, Level } from "../level";

interface IWeaponData {
  fireRate: number;
  magazineSize: number;
  reloadTime: number;
  muzzlePosition: number[];
  bulletType: string;
}

export default class WeaponLogic implements IComponent {
    data: IWeaponData;
    fireTimer: number;
    magazine: number;
    bulletSpeed: number;
    realTime: number;
    owner: Entity;
    bulletToml: any;
    bulletsFired: Entity[];
    position: any;

    constructor(data: IWeaponData, owner: Entity) {
        this.data = data;
        this.bulletsFired = [];
        this.fireTimer = 0;
        this.magazine = this.data.magazineSize;
        this.owner = owner;
        this.bulletToml = require(`../toml/${this.data.bulletType || 'enemyBullet'}.toml`);
    }

    initialize() {
        this.owner.addEventListener('fire', this.tryFire.bind(this));
    }

    destroy() {
        return;
    }

    tryFire(dir: THREE.Vector2) {
        if(this.magazine <= 0) {
            if(this.fireTimer > this.data.reloadTime) {
                this.magazine = this.data.magazineSize;
            } else {
                return;
            }
        }

        if(this.fireTimer > this.data.fireRate) {
            // spawning bullet
            const firedBullet = new Entity(this.bulletToml);
            firedBullet.sharedData.mousePositions = (dir !== undefined ?
                                                     dir :
                                                     new THREE.Vector2(mouse.mouse.xp, mouse.mouse.yp).normalize());
            firedBullet.sharedData.sender = this.owner.parent;

            // setting position
            const newPosition = new THREE.Vector3();
            newPosition.copy(this.owner.parent.position);
            newPosition.add(this.owner.position);
            newPosition.add(new THREE.Vector3(this.data.muzzlePosition[0], this.data.muzzlePosition[1], 0));

            levelManager.currentLevel.addEntity(firedBullet);
            this.bulletsFired.push(firedBullet);
            firedBullet.position.copy(newPosition);
            this.fireTimer = 0;
            this.magazine--;
        }
    }
    update(dt) {
        this.fireTimer += dt;
    }
}
