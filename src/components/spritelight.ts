import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';
import {keyboard} from '../lib/input';

interface ISpritelightData {
    radius: number;
    color: number[];
    offset?: number[];
}

const Spritelights: Spritelight[] = [];

export function getAllSpritelights() {
    return levelManager.currentLevel.getAllComponents('spritelight') as Array<Spritelight>;
}

export default class Spritelight implements IComponent {
    data: ISpritelightData;
    owner: Entity;

    constructor(data: ISpritelightData, owner: Entity) {
        this.data = data;
        this.owner = owner;
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
