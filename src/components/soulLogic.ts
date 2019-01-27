import Collider from './collider';
import Sprite from './sprite';
import { IComponent } from "./component";
import Entity from "../entity";
import * as THREE from "three";
import { mouse } from "../lib/input";
import weaponLogic from './weaponLogic';
import {levelManager} from '../level';

export default class SoulLogic implements IComponent {
    owner: Entity;

    constructor(data: any, owner: Entity) {
        // this.data = data; No data yet
        this.owner = owner;
        function resolveSoulCollision(other: Entity) {
            if(other !== owner && other !== this.owner.sharedData.sender) {

                // Check if we are colliding with the player
                const collider = other.getComponent('collider') as Collider;
                if((collider.data.collisionMask & 1) === 0) return;

                levelManager.currentLevel.removeEntity(this.owner);
            }
        }

        this.owner.on('collided', resolveSoulCollision.bind(this));
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

    update(dt) {
        return;
    }
}
