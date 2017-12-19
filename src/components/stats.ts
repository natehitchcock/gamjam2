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
            const bl: any = other.components.find(comp => ((comp as any).type === 'bullet'));
            if(bl && bl.owner.sharedData.sender !== this.owner) {
                this.owner.sendEvent('damaged', bl.damage);
            }
        });

        this.owner.on('damaged', damage => {this.owner.sharedData.health -= damage;});
    }

    initialize() {
        this.owner.sharedData.health = this.data.health;
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
