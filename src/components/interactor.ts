import {IComponent} from './component';
import Entity from '../entity';
import * as Input from '../lib/input';
import {levelManager} from '../level';
import * as THREE from 'three';

interface IInteractorData {
    radius: number;
}

export default class Interactor implements IComponent {
    data: IInteractorData;
    owner: Entity;

    constructor(data: IInteractorData, owner: Entity) {
        this.data = data;
        this.owner = owner;
    }

    findInteractable(): Entity {
        let closestEntity;
        let distance = this.data.radius;
        levelManager.currentLevel.entities.forEach(ent => {
            const targetPos = ent.position.clone();
            targetPos.z = 0;
            const ownerPos = this.owner.position.clone();
            ownerPos.z = 0;

            const dv = ownerPos.distanceTo(targetPos);
            if(dv < distance) {
                if(ent.hasEvent('interact')) {
                    closestEntity = ent;
                    distance = dv;
                }
            }
        }, this);

        return closestEntity;
    }

    initialize() {
        Input.on('interact', value => {
            if(value === 0) return;
            const nearestInteractable = this.findInteractable();
            if(nearestInteractable) {
                nearestInteractable.sendEvent('interact', this.owner);
            }
            console.log('interacted');
        }, this);
    }

    destroy() {
        return;
    }

    update(dt) {
        return;
    }
}
