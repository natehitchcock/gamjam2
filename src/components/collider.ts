import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';

const allColliders: Collider[] = [];

interface IColliderData {
    radius: number;
}

export default class Collider implements IComponent {
    data: IColliderData;

    constructor(data: IColliderData, owner: Entity) {
        this.data = data;
        allColliders.push(this);
    }

    update(dt: number) {
        allColliders.forEach(element => {
            return;// [TODO] collision detection code here
        });
    }
}
