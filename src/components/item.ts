import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';
import Inventory from './inventory';

interface IItemData {
    type: string;
    stackable: boolean;
    activatable: boolean;
    description: string;
}

export default class Item implements IComponent {
    data: IItemData;
    owner: Entity;

    constructor(data: IItemData, owner: Entity) {
        this.data = data;
        this.owner = owner;
    }

    initialize() {
        this.owner.on('interact', (playerEntity: Entity) => {
            const inv: Inventory = playerEntity.getComponent('inventory') as Inventory;

            if(inv) {
                inv.addItem(this.owner, 0, 40);
            }
        });
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
}
