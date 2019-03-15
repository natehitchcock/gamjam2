import * as THREE from 'three';
import Entity from '../../entity';
import { IComponent } from '../component';
import { levelManager } from '../../level';

export interface IEffectData {
    onEvent: string;
}

export class Effect implements IComponent {
    data: IEffectData;
    owner: Entity;
    target: Entity;
    effectEventId: string;

    constructor(data: IEffectData, owner: Entity) {
        this.data = data;
        this.owner = owner;

        if (this.data.onEvent) {
            this.effectEventId = this.owner.on(
            this.data.onEvent,
            this.activate,
            this,
            );
        }
    }

    activate() {
        console.log('activated');
        return;
    }

    initialize() {
        return;
    }

    uninitialize() {
        return;
    }

    destroy() {
        if (this.data.onEvent) {
            this.owner.off(this.data.onEvent, this.effectEventId);
        }
        return;
    }

    update(dt: number) {
        return;
    }
}
