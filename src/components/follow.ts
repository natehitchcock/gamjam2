import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';

interface IFollowData {
    targetLabel: string;
    xoff: number;
    yoff: number;
    maxRadius: number;
    interpSpeed: number;
}

export default class Follow implements IComponent {
    data: IFollowData;
    owner: Entity;
    target: Entity;

    constructor(data: IFollowData, owner: Entity) {
        this.data = data;
        this.owner = owner;

        this.target = levelManager.currentLevel.getEntityByLabel(data.targetLabel);
    }

    update(dt: number) {
        const movement = new THREE.Vector3(this.data.xoff || 0, this.data.yoff || 0, 0)
        .add(this.owner.position);

        movement.sub(this.target.position);
        const dist = movement.length();

        movement.normalize();
        movement.multiplyScalar(Math.min(dist, (this.data.interpSpeed || 1) * dt));
        this.owner.position.add(movement);
    }
}
