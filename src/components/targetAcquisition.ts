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
                const dv = this.owner.position.distanceTo(ent.position);
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
            const targetDirection = this.target.position.clone();
            targetDirection.sub(this.owner.position);
            // [TODO] adapt fire function to take points or directions (using .w 0 or 1)
            this.owner.sendEvent('fire', targetDirection);
            console.log('firing!!! from target acquisition');
        }
    }
}
