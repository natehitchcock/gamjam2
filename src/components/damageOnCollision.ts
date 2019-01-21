import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';
import Inventory from './inventory';

interface IDamageOnCollisionData {
    damage: number;
    selfDamage: number;
}

export default class DamageOnCollision implements IComponent {
    data: IDamageOnCollisionData;
    owner: Entity;

    constructor(data: IDamageOnCollisionData, owner: Entity) {
        this.data = data;
        this.owner = owner;
    }

    initialize() {
        this.owner.on('collided', (other: Entity) => {

            // Collision with walls and inanimate objects wont have components
            if(other.components === undefined) return;

            other.sendEvent('damaged', this.data.damage);
            this.owner.sendEvent('damaged', this.data.selfDamage);
        });
    }

    uninitialize() {
        return;
      }

    destroy() {
        return;
    }

    update(dt: number) {
        return;
    }
}
