import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';
import Inventory from './inventory';

interface IChangeStatsData {
    onEvent: string;
    actOnPickUp: boolean;
    statsChanged: {[key: string]: number};
}

export default class ChangeStats implements IComponent {
    data: IChangeStatsData;
    owner: Entity;

    constructor(data: IChangeStatsData, owner: Entity) {
        this.data = data;
        this.owner = owner;

        this.owner.on('pickedUp', (playerEntity: Entity) => {
            this.onPickup(playerEntity);
        });
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

    update(dt: number) {
        return;
    }

    private onPickup(playerEntity: Entity) {
        if(this.data.statsChanged === undefined) return;

        let target: Entity = this.owner;

        if(this.data.actOnPickUp) {
            target = playerEntity;
        }

        for(const statName in this.data.statsChanged) {
            if(this.data.statsChanged[statName] === undefined) continue;

            // Write the stat change to the global stat cache?
            if(target.sharedData[statName] === undefined) {
                target.sharedData[statName] = 0;
            }

            const amount = this.data.statsChanged[statName];
            target.sharedData[statName] += amount;
            console.log(`changed ${statName} to ${target.sharedData[statName]}`);
        }

        target.sendEvent('statsChanged');
    }

    // private onDrop(playerEntity: Entity) {

    // }
}
