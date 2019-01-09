import * as THREE from 'three';
import Entity from '../../entity';
import {IComponent} from '../component';
import {levelManager} from '../../level';
import {IFollowData, Follow} from './follow';

interface IOrbitTargetData extends IFollowData {
    orbitFactor: number;
    orbitShrinkRate: number;
    orbitingTriggerDistance: number;
}

export default class OrbitTarget extends Follow {
    data: IOrbitTargetData;
    owner: Entity;
    target: Entity;
    orbitFactor: number;

    constructor(data: IOrbitTargetData, owner: Entity) {
        super(data, owner);

        this.data = data;
        this.owner = owner;

        this.target = levelManager.currentLevel.getEntityByLabel(data.targetLabel);
        this.orbitFactor = this.data.orbitFactor;
    }

    initialize() {
        return;
    }

    destroy() {
        return;
    }

    update(dt: number) {
        const dist = this.getDistanceTo(this.target.position);

        if(dist <= this.data.orbitingTriggerDistance) {
            let orbitTargetOffset: THREE.Vector3 = this.getOrthogonalMovementVector(this.target.position);
            orbitTargetOffset = orbitTargetOffset.multiplyScalar(this.data.orbitFactor || 1);
            orbitTargetOffset = orbitTargetOffset.add(this.target.position);

            this.moveTo(orbitTargetOffset, dt);

            this.shrinkOrbit(dt);
        } else {
            this.resetOrbit();
        }
    }

    getOrthogonalMovementVector(targetPosition: THREE.Vector3) {
        const ownerPos = new THREE.Vector3(this.data.xoff || 0, this.data.yoff || 0, 0)
        .add(this.owner.position);

        ownerPos.sub(targetPosition);

        const negativeMovement = ownerPos.normalize();
        const newX = -negativeMovement.y;
        negativeMovement.y = negativeMovement.x;
        negativeMovement.x = newX;

        return negativeMovement;
    }

    resetOrbit() {
        this.orbitFactor = this.data.orbitFactor;
    }

    shrinkOrbit(dt: number) {
        this.orbitFactor -= this.data.orbitShrinkRate * dt;
        this.orbitFactor = Math.max(0, this.orbitFactor);
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
