import * as THREE from 'three';
import Entity from '../entity';
import BulletLogic from './bulletLogic';
import {IComponent} from './component';
import {levelManager} from '../level';

interface IStatsData {
    health: number;
    barriers: number;
    destroyOnDeath: boolean;
}

export default class Stats implements IComponent {
    data: IStatsData;
    owner: Entity;
    damage: number = 0;

    constructor(data: IStatsData, owner: Entity) {
        this.data = data;
        this.owner = owner;

        this.owner.on('collided', (other: Entity) => {
            // Collision with walls and inanimate objects wont have components
            if(other.components === undefined || other.components.length === 0) return;

            const bl: any = other.components.find(comp => ((comp as any).type === 'bullet'));
            if(bl && other.sharedData.sender) {
                if(other.sharedData.sender.team !== this.owner.team
                    || other.sharedData.sender.team === 0) {
                    console.log(`doing ${bl.getDamage()} damage`);
                    this.owner.sendEvent('damaged', bl.getDamage());
                    return;
                }
            }

            const sl: any = other.components.find(comp => ((comp as any).type === 'soul'));
            if(sl) {
                this.owner.sendEvent('soulConsumed', 1);
            }
        });

        this.owner.on('statsChanged', () => {
            this.owner.sharedData.health = this.data.health
                + (this.data.barriers || 0)
                + (this.owner.sharedData.shields || 0)
                - this.damage;

            this.owner.sendEvent('statsUpdated');
        });

        this.owner.on('damaged', damage => {
            this.damage += damage;
            this.owner.sharedData.health = this.data.health
                + (this.data.barriers || 0)
                + (this.owner.sharedData.shields || 0)
                - this.damage;

            this.owner.sendEvent('statsUpdated');
        });

        this.owner.on('soulConsumed', worth => {
            this.owner.sharedData.souls += worth;
            this.owner.sendEvent('statsUpdated');
        });
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

           if(this.data.destroyOnDeath) {
                levelManager.currentLevel.removeEntity(this.owner);
           }

           this.damage = 0;
       }
    }
}
