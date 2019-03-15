import * as THREE from 'three';
import Entity from '../entity';
import * as InputManager from '../lib/input';
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

    private activateItemFID: number;

    constructor(data: IInventoryData, owner: Entity) {
        this.data = data;
        this.owner = owner;
        this.itemRefs = [];
        
        this.activateItemFID = InputManager.on('activateItem', this.activateItem);
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

        itemRef.persistent = true;

        this.owner.add(itemRef);
        // levelManager.currentLevel.removeEntity(itemRef);

        itemRef.parent=this.owner;
        itemRef.position.x = offsetX || 0;
        itemRef.position.y = offsetY || 0;
        this.itemRefs.push(itemRef);
    }

    activateItem = (value: number) => {
        if(value === 0) return;
        console.log('activating items');
        this.itemRefs.forEach(item => {
            console.log('sending activate to ' + item.label)
            item.sendEvent('activate');
        })
    }

    uninitialize() {
        return;
      }

    destroy() {
        if(this.activateItemFID)
        {
            InputManager.off('activateItem', this.activateItemFID);
        }
    }

    update(dt: number) {
        // this.itemRefs.forEach((item)  =>  {
        //     item.update(dt);
        // });
    }
}
