import * as winston from 'winston';
import { IComponent } from "./component";
import Entity from "../entity";
import { mouse, keyboard } from "../lib/input";
import * as THREE from "three";
import { levelManager, Level } from "../level";

export interface IWeaponData {
  fireRate: number;
  magazineSize: number;
  reloadTime: number;
  spread: number;
  muzzlePosition: number[];
  weaponOffset: number[];
  meleeOffset: number[];
  bulletType: string;
  meleeType: string;
  useParentForAim: boolean;
  rotateToAimVector: boolean;
}

export default class WeaponLogic implements IComponent {
    data: IWeaponData;
    fireTimer: number;
    magazine: number;
    bulletSpeed: number;
    realTime: number;
    owner: Entity;
    bulletToml: any;
    meleeToml: any;
    position: any;
    facingAngle: number;

    constructor(data: IWeaponData, owner: Entity) {
        this.data = data;
        this.fireTimer = 0;
        this.magazine = this.data.magazineSize;
        this.owner = owner;
        this.bulletToml = require(`../toml/${this.data.bulletType || 'enemyBullet'}.toml`);
        this.meleeToml = require(`../toml/${this.data.meleeType || 'playerMeleeSwipe'}.toml`);

        this.owner.on('fire', this.tryFire.bind(this));
        this.owner.on('melee', this.tryMelee.bind(this));
    }

    initialize() {
        return;
    }

    uninitialize() {
        return;
      }

    destroy() {
        return;
    }

    tryFire(dir: THREE.Vector2) {
        if(this.magazine <= 0) {
            return;
        }

        if(this.fireTimer > this.data.fireRate) {

            // Update which direction I'm facing
            this.updateLookAt();

            // spawning bullet
            const firedBullet = new Entity(this.bulletToml);
            firedBullet.sharedData.tomlFile = this.data.bulletType;
            firedBullet.sharedData.mousePositions =
                new THREE.Vector2(
                    Math.cos(this.facingAngle),
                    Math.sin(this.facingAngle));
            const player = this.owner.parent as Entity;
            if(player && player.sharedData) {
                firedBullet.sharedData.bulletSpeed = player.sharedData.bulletSpeed || 0;
                const scale = firedBullet.sharedData.bulletSize = player.sharedData.bulletSize || 1;
                firedBullet.sharedData.additionalDamage = player.sharedData.additionalDamage || 0;
                console.log(`bullets additional damage is ${firedBullet.sharedData.additionalDamage}`);
                firedBullet.sharedData.damageMultiplier = player.sharedData.damageMultiplier || 1;
                firedBullet.scale.multiplyScalar(scale);
            }

            let sender: Entity;
            if(this.owner.parent instanceof Entity) sender = this.owner.parent;
            else sender = this.owner;

            firedBullet.team = sender.team;

            firedBullet.sharedData.sender = sender;

            let aimAngle = 0;
            if(this.data.rotateToAimVector) {
                aimAngle = this.facingAngle;
            }
            // setting position
            const newPosition = new THREE.Vector3();
            newPosition.copy(this.owner.parent.position);
            newPosition.add(this.owner.position);
            newPosition.add(new THREE.Vector3(
                this.data.muzzlePosition[0] * Math.cos(aimAngle)
                    + this.data.muzzlePosition[1] * Math.sin(aimAngle),
                this.data.muzzlePosition[0] * Math.sin(aimAngle)
                    + this.data.muzzlePosition[1] * -Math.cos(aimAngle),
                this.data.muzzlePosition[2] || 0));

            levelManager.currentLevel.addEntity(firedBullet);
            firedBullet.position.copy(newPosition);
            this.fireTimer = 0;
            this.magazine--;

            this.owner.sendEvent('fired');
        }
    }

    tryMelee(dir: THREE.Vector2) {
        console.log('meleeing');

        // spawning bullet
        this.updateLookAt();

        const firedBullet = new Entity(this.meleeToml);
        firedBullet.sharedData.tomlFile = this.data.meleeType;
        const fireDirection = dir || new THREE.Vector2(mouse.mouse.xp, -mouse.mouse.yp).normalize();
        let angle = Math.atan2(fireDirection.y, fireDirection.x) * THREE.Math.RAD2DEG;
        angle += (Math.random() - 0.5) * this.data.spread;
        angle *= THREE.Math.DEG2RAD;
        firedBullet.sharedData.mousePositions = new THREE.Vector2(Math.cos(angle), Math.sin(angle));

        let sender: Entity;
        if(this.owner.parent instanceof Entity) sender = this.owner.parent;
        else sender = this.owner;

        firedBullet.sharedData.sender = sender;
        firedBullet.team = sender.team;

        let aimAngle = 0;
        if(this.data.rotateToAimVector) {
            aimAngle = this.facingAngle;
        }

        // setting position
        const newPosition = new THREE.Vector3();
        newPosition.copy(this.owner.parent.position);
        newPosition.add(this.owner.position);
        newPosition.add(new THREE.Vector3(
            this.data.meleeOffset[0] * Math.cos(aimAngle)
                + this.data.meleeOffset[1] * Math.sin(aimAngle),
            this.data.meleeOffset[0] * Math.sin(aimAngle)
                + this.data.meleeOffset[1] * -Math.cos(aimAngle),
            this.data.meleeOffset[2] || 0));

        levelManager.currentLevel.addEntity(firedBullet);
        firedBullet.position.copy(newPosition);
        this.fireTimer = 0;
        this.magazine--;

        this.owner.sendEvent('meleed');
    }

    update(dt) {
        this.fireTimer += dt;

        if(this.magazine <= 0) {
            if(this.fireTimer > this.data.reloadTime) {
                this.magazine = this.data.magazineSize;
                this.owner.sendEvent('reloaded');
            }
        }

        this.updateLookAt();
    }

    updateLookAt() {
        // Rotate to face owners parent aim direction
        let sharedData;
        const parent: Entity = this.owner.parent as Entity;

        if(this.data.useParentForAim && parent) {
            sharedData = parent.sharedData;
        } else {
            sharedData = this.owner.sharedData;
        }

        if (sharedData) {
            const aimVector: THREE.Vector2 = sharedData.look ? sharedData.look.clone() : undefined;
            if(aimVector && aimVector.lengthSq() > 0.01) {
                const angle = Math.atan2(aimVector.y, aimVector.x);
                const euler = new THREE.Euler(0, 0, angle);
                this.facingAngle = angle;

                if(this.data.rotateToAimVector) {
                    this.owner.setRotationFromEuler(euler);

                    const offset = new THREE.Vector3(
                        this.data.weaponOffset[0] * Math.cos(angle) + this.data.weaponOffset[1] * Math.sin(angle),
                        this.data.weaponOffset[0] * Math.sin(angle) + this.data.weaponOffset[1] * -Math.cos(angle),
                        this.data.weaponOffset[2]);

                    this.owner.position.copy(offset);

                    if(angle > Math.PI / 2 || angle < -Math.PI/2) {
                        this.owner.scale.y = -1;
                    } else {
                        this.owner.scale.y = 1;
                    }
                }
            }
        }
    }
}
