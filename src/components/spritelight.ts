import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';
import {keyboard} from '../lib/input';

interface ISpritelightData {
    radius: number;
    offset?: number[];
}

const Spritelights = [];

export function getAllSpritelights() {
    return Spritelights;
}

export default class Spritelight implements IComponent {
    data: ISpritelightData;

    constructor(data: ISpritelightData, owner: Entity) {
        this.data = data;
    }

    initialize() {
        Spritelights.push(this);
    }

    destroy() {
        Spritelights.splice(Spritelights.indexOf(this), 1);
    }

    update(dt: number) {
        return;
    }
}
