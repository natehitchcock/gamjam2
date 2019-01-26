import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';
import Inventory from './inventory';

interface IMoveEntity {
    label: string;
    offset: number[];
}

interface IMoveEntitiesOnInitData {
    entities: IMoveEntity[];
}

export default class MoveEntitiesOnInit implements IComponent {
    data: IMoveEntitiesOnInitData;
    owner: Entity;

    constructor(data: IMoveEntitiesOnInitData, owner: Entity) {
        this.data = data;
        this.owner = owner;
    }

    initialize() {
        if(this.data.entities === undefined) return;

        this.data.entities.forEach(entDat => {
            const ent = levelManager.currentLevel.getEntityByLabel(entDat.label);
            if(ent === undefined) return;

            const offset = [0, 0, 0];

            if(entDat.offset) {
                offset[0] += entDat.offset[0] || 0;
                offset[1] += entDat.offset[1] || 0;
                offset[2] += entDat.offset[2] || 0;
            }

            ent.position.x = this.owner.position.x + offset[0];
            ent.position.y = this.owner.position.y + offset[1];
            ent.position.z = this.owner.position.z + offset[2];

            console.log(`moved ${entDat.label} to ${ent.position.toArray().toString()}`);
        });
        return;
    }

    uninitialize() {
        return;
      }

    destroy() {
        return;
    }

    update(dt: number) {
        return;
    }
}
