import * as THREE from 'three';
import Entity from '../../entity';
import {IComponent} from '../component';

interface ISwayData {
    horizMagnitude: number;
    horizFrequency: number;
    vertMagnitude: number;
    vertFrequency: number;
    horizTimeOffset: number;
    vertTimeOffset: number;
}

export default class Sway implements IComponent {
    data: ISwayData;
    owner: Entity;

    currentTime: number;

    constructor(data: ISwayData, owner: Entity) {
        this.data = data;
        this.owner = owner;
        this.currentTime = 0;
    }

    initialize() {
        return;
    }

    destroy() {
        return;
    }

    update(dt: number) {
        const nextTime = this.currentTime + dt;
        const currentVec = new THREE.Vector3(
            Math.cos((this.currentTime + this.data.horizTimeOffset)
                * this.data.horizFrequency) * this.data.horizMagnitude,
            Math.sin((this.currentTime + this.data.vertTimeOffset)
                * this.data.vertFrequency) * this.data.vertMagnitude,
                0,
        );

        const nextVec =  new THREE.Vector3(
            Math.cos((nextTime + this.data.horizTimeOffset)
                * this.data.horizFrequency) * this.data.horizMagnitude,
            Math.sin((nextTime + this.data.vertTimeOffset)
                * this.data.vertFrequency) * this.data.vertMagnitude,
                0,
        );

        // Apply next vec as a position delta
        //  The benefit of this additive sway over an absolute position.copy
        //  is that we can now move and apply the sway while moving
        nextVec.sub(currentVec);
        this.owner.position.add(nextVec);
        this.currentTime = nextTime;
    }
}
