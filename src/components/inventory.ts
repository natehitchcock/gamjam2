import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';

interface IInventoryItem {
    label: string;
    x: number;
    y: number;
    isVisible: boolean;
}

interface IInventoryData {
    items: IInventoryItem[];
}

export default class Inventory implements IComponent {
    data: IInventoryData;
    owner: Entity;
    itemRefs: Entity[];

    constructor(data: IInventoryData, owner: Entity) {
        this.data = data;
        this.itemRefs = [];

        this.data.items.forEach(item => {
            if(!item.label || item.label.length < 1) {
                console.log('no label on item in inventory creation');
                return;
            }
            const itemRef = levelManager.currentLevel.getEntityByLabel(item.label);
            levelManager.currentLevel.removeEntity(itemRef);
            owner.add(itemRef);
            itemRef.position.x = item.x || 0;
            itemRef.position.y = item.y || 0;
            this.itemRefs.push(itemRef);
        });
    }

    update(dt: number) {
        return;
    }
}
