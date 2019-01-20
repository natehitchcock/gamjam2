import * as THREE from 'three';
import Entity from '../entity';
import BulletLogic from './bulletLogic';
import {IComponent} from './component';
import {levelManager} from '../level';

interface IStatsData {
    health: number;
}

export default class Stats implements IComponent {
    data: IStatsData;
    owner: Entity;

    constructor(data: IStatsData, owner: Entity) {
        this.data = data;
        this.owner = owner;

        this.owner.on('collided', (other: Entity) => {
            // Collision with walls and inanimate objects wont have components
            if(other.components === undefined || other.components.length === 0) return;

            const bl: any = other.components.find(comp => ((comp as any).type === 'bullet'));
            if(bl && bl.owner.sharedData.sender !== this.owner) {
                this.owner.sendEvent('damaged', bl.damage);
                return;
            }

            const sl: any = other.components.find(comp => ((comp as any).type === 'soul'));
            if(sl) {
                this.owner.sendEvent('soulConsumed', 1);
            }
        });

        this.owner.on('damaged', damage => {this.owner.sharedData.health -= damage;});
        this.owner.on('soulConsumed', worth => {this.owner.sharedData.souls += worth;});
    }

    initialize() {
        this.owner.sharedData.health = this.data.health;
        this.owner.sharedData.souls = 0;
        return;
    }

    uninitialize() {
        return;
      }

    destroy() {
        return;
    }

    update(dt: number) {
       if(this.owner.sharedData.health <= 0) {
           this.owner.sendEvent('died');
           levelManager.currentLevel.removeEntity(this.owner);
       }
    }
}
