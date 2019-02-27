import * as THREE from 'three';
import Entity from '../../entity';
import {IComponent} from '../component';
import {levelManager} from '../../level';
import {IFollowData, Follow} from './follow';

interface IFollowTargetData extends IFollowData {
    speed: number;
}

// Follows a target in the world
export default class FollowTarget {
    data: IFollowTargetData;
    owner: Entity;
    target: Entity;

    constructor(data: IFollowTargetData, owner: Entity) {
        this.data = data;
        this.owner = owner;
    }

    initialize() {
        return;
    }

    uninitialize() {
        return;
        }

    destroy() {
        return;
    }

    update(dt: number) {
        if(this.owner.sharedData.target !== undefined) {
            this.target = this.owner.sharedData.target;
        } else {
            this.target = undefined;
        }

        if(this.target) {
            const targetPos = this.target.position.clone();
            const myPos = this.owner.position.clone();

            const dir = targetPos.sub(myPos).normalize();

            this.owner.sharedData.nextMove = dir.multiplyScalar(this.data.speed);
        }
    }

    getDistanceTo(targetPosition: THREE.Vector3) {
        const ownerPos = new THREE.Vector3(this.data.xoff || 0, this.data.yoff || 0, 0)
        .add(this.owner.position);

        const movement = new THREE.Vector3().copy(this.target.position);
        movement.sub(ownerPos);
        movement.z = 0;

        return movement.length();
    }
}
