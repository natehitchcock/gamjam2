import Collider from './collider';
import Sprite from './sprite';
import { IComponent } from "./component";
import Entity from "../entity";
import * as THREE from "three";
import { mouse } from "../lib/input";
import weaponLogic from './weaponLogic';
import {levelManager} from '../level';

interface IBulletData {
    damageMultiplier: number;
    bulletLife: number;
    speed: number;
    pattern: number;
    lifetime?: number;
}

export default class BulletLogic implements IComponent {
    data: IBulletData;
    owner: Entity;
    x: number = 0;
    y: number = 0;
    damage: number;
    lifetime: number;

    constructor(data: IBulletData, owner: Entity) {
        this.data = data;
        this.owner = owner;
        this.damage = this.data.damageMultiplier || 1;
        this.lifetime = 0;

        function resolveBulletCollision(other: any) {
            if(other !== this.owner.sharedData.sender) {
                const ent = (other as Entity);
                if( ent.components && ent.components.find(comp => comp.type === 'bullet' || comp.type === 'soul')) {
                    return;
                }

                levelManager.currentLevel.removeEntity(this.owner);
            }
        }

        this.owner.on('collided', resolveBulletCollision.bind(this));
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

    movement(dt: number) {
        this.lifetime += dt;

        if(this.data.lifetime) {
            if(this.lifetime >= this.data.lifetime) {
                levelManager.currentLevel.removeEntity(this.owner);
            }
        }

        const bulletSpeed = (this.data.speed);
        // making it move
        this.owner.sharedData.nextMove = new THREE.Vector3(0, 0, 0);
        const bulletPosition = this.owner.sharedData.nextMove;
        const bulletDirection = new THREE.Vector3().copy(this.owner.sharedData.mousePositions);
        (bulletDirection).multiplyScalar(bulletSpeed);
        bulletPosition.y += bulletDirection.y;
        bulletPosition.x += bulletDirection.x;

        /* //  console.log(this.data.speed);
           /*var bulletPosition = Entity;
           var speed = require('../toml/weapon.toml');
           var x = bulletPosition.x,;
           y bulletPosition.y;
           }
           const speed = this.data.speed;
           const pattern = this.data.pattern;
           const direction = new THREE.Vector3();
          // direction.copy(this.owner.position);

           const bulletPath = new THREE.Vector3(this.currentXPosition, currentYPosition);
          // var aimDirection = new THREE.Vector3(1).multiplyScalar;
           this.owner.position.add(bulletPath);*/
    }

    update(dt) {
        this.movement(dt);

        const parentAimVector: THREE.Vector2 =
            this.owner.sharedData.mousePositions ? this.owner.sharedData.mousePositions.clone() : undefined;

        if(parentAimVector && parentAimVector.lengthSq() > 0.01) {
            const angle = Math.atan2(parentAimVector.y, parentAimVector.x);
            const euler = new THREE.Euler(0, 0, angle - 3.14159/2);
            this.owner.setRotationFromEuler(euler);
        }
    }
}
