import * as THREE from 'three';
import { IComponent } from "./component";
import Entity from '../entity';
import {levelManager} from '../level';

interface ITargetAcquisitionData {
    detectionRadius: number;
    targetPlayers: boolean;
}

export default class TargetAcquisition implements IComponent {
    data: ITargetAcquisitionData;
    target: Entity;
    owner: Entity;

    constructor(data: ITargetAcquisitionData, owner: Entity) {
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

    findClosestTarget() {
        let distance= 0;
        let targetEnt: Entity;
        levelManager.currentLevel.entities.forEach(ent => {
            let canTarget = false;
            const isPlayer = ent.getComponent('controller') !== undefined;
            if(this.data.targetPlayers && isPlayer) canTarget = true;
            if(!this.data.targetPlayers && !isPlayer) canTarget = true;

            if(canTarget) {
                const ownerPosition = this.owner.position.clone();
                ownerPosition.z = 0;

                const entPosition = ent.position.clone();
                entPosition.z = 0;

                const dv = ownerPosition.distanceTo(entPosition);
                if(dv < this.data.detectionRadius
                && (targetEnt === undefined || dv < distance)) {
                    targetEnt = ent;
                    distance = dv;
                }
            }
        }, this);

        return targetEnt;
    }

    update(dt) {
        if(this.target === undefined) {
            this.target = this.findClosestTarget();
        } else {
            const dv = this.owner.position.distanceTo(this.target.position);

            if(dv > this.data.detectionRadius) {
                this.target = undefined;
            }

            const targetDirection = this.target.position.clone();
            targetDirection.sub(this.owner.position);

            this.owner.sharedData.rawLastLook = this.owner.sharedData.rawLook;
            this.owner.sharedData.rawLook = targetDirection.clone();

            this.owner.sharedData.lastLook =
                this.owner.sharedData.look ? this.owner.sharedData.look.clone() : undefined;

            if(targetDirection.length() > 0.3) {
                this.owner.sharedData.look = targetDirection.normalize().clone();
            } else {
                this.owner.sharedData.look = new THREE.Vector2(0, 0);
            }

            // [TODO] adapt fire function to take points or directions (using .w 0 or 1)
            this.owner.sendEvent('fire', targetDirection);
        }
    }
}
