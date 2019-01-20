import * as THREE from 'three';
import Entity from '../../entity';
import {IComponent} from '../component';
import {levelManager} from '../../level';

export interface IFollowData {
    targetLabel: string;
    xoff: number;
    yoff: number;
    maxRadius: number;
    interpSpeed: number;
    interp: string;
}

export class Follow implements IComponent {
    data: IFollowData;
    owner: Entity;
    target: Entity;

    constructor(data: IFollowData, owner: Entity) {
        this.data = data;
        this.owner = owner;
    }

    initialize() {
        this.target = levelManager.currentLevel.getEntityByLabel(this.data.targetLabel);
        return;
    }

    uninitialize() {
        return;
    }

    destroy() {
        return;
    }

    update(dt: number) {
        if(this.target) {
            this.moveTo(this.target.position, dt);
        } else {
            this.target = levelManager.currentLevel.getEntityByLabel(this.data.targetLabel);
        }
    }

    moveTo(targetPosition: THREE.Vector3, dt: number) {
        const ownerPos = new THREE.Vector3(this.data.xoff || 0, this.data.yoff || 0, 0)
        .add(this.owner.position);

        const movement = new THREE.Vector3().copy(targetPosition);
        movement.sub(ownerPos);
        movement.z = 0;
        const dist = movement.length();

        if(dist > (this.data.maxRadius || 1)) {
            if(this.data.interp === "linear" || this.data.interp === undefined ) {
                movement.normalize();
                movement.multiplyScalar(Math.min(dist, (this.data.interpSpeed || 1) * dt));
                this.owner.position.add(movement);
            } else if (this.data.interp === "eased") {
                movement.multiplyScalar(this.data.interpSpeed * dt);
                this.owner.position.add(movement);
            }
        }
    }
}
