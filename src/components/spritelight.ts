import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';
import {keyboard} from '../lib/input';

enum SpriteLightStyle {
    Flat,
    Noisy,
    Throbbing,
}

interface ISpritelightData {
    radius: number;
    color: number[];
    offset?: number[];
    style?: number;
}

const Spritelights: Spritelight[] = [];

export function getAllSpritelights() {
    return levelManager.currentLevel.getAllComponents('spritelight') as Spritelight[];
}

let idx = 0;
export default class Spritelight implements IComponent {
    data: ISpritelightData;
    owner: Entity;
    myIdx: number;
    constructor(data: ISpritelightData, owner: Entity) {
        this.data = data;
        this.owner = owner;
        this.myIdx = idx++;
    }

    initialize() {
        Spritelights.push(this);
        console.log('added spriteLight ' + this.myIdx);
    }

    uninitialize() {
        Spritelights.splice(Spritelights.indexOf(this), 1);
        console.log('removed spriteLight ' + this.myIdx);
        return;
      }

    destroy() {
        return;
    }

    update(dt: number) {
        return;
    }
}
