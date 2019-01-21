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
        this.owner = owner;
        this.itemRefs = [];
    }

    initialize() {
        this.data.items.forEach(item => {

            if(!item.label || item.label.length < 1) {
                console.log('no label on item in inventory creation');
                return;
            }

            const itemRef = levelManager.currentLevel.getEntityByLabel(item.label);
            this.addItem(itemRef, item.x, item.y);
        }, this);
    }

    addItem(itemRef: Entity, offsetX?: number, offsetY?: number) {

        // If the item is null or it has already been parented to me
        if(itemRef === undefined || itemRef.parent === this.owner) return;

        this.owner.add(itemRef);
        levelManager.currentLevel.removeEntity(itemRef);

        itemRef.parent=this.owner;
        itemRef.position.x = offsetX || 0;
        itemRef.position.y = offsetY || 0;
        this.itemRefs.push(itemRef);
    }

    uninitialize() {
        return;
      }

    destroy() {
        this.itemRefs.forEach(entity => entity.destroy());
    }

    update(dt: number) {
        this.itemRefs.forEach((item)  =>  {
            item.update(dt);
        });
    }
}
