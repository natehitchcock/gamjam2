import Entity from '../../entity'
import {Effect, IEffectData} from './effect'
import {levelManager, Level} from '../../level'
import { TetrahedronGeometry } from 'three';

export interface IReverseBulletsEffectData extends IEffectData {
    effectiveRadius: number;
}

export class ReverseBulletsEffect extends Effect {
    data: IReverseBulletsEffectData;

    constructor(data: IReverseBulletsEffectData, owner: Entity) {
        super(data, owner);

        this.data = data;
        console.log('~!+@_~!+@_~!_@+_~!_@~+!_@_~!@+~!_@+~_@_!_@~+_!+@_~+!_@+_!')
    }

    activate() {
        super.activate();

        const allBullets = levelManager.currentLevel.getEntitiesByLabel('bullet');

        if(parent) {
            allBullets.forEach(bullet => {
                const distance = bullet.position.distanceTo(this.owner.getWorldPosition());

                if(distance <= this.data.effectiveRadius) {
                    (bullet.sharedData.mousePositions as THREE.Vector3).multiplyScalar(-1);
                    bullet.team = 0;
                }
            });
        }

        return;
    }
}