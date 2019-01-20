import { IComponent } from "./component";
import Entity from "../entity";
import * as THREE from "three";
import {levelManager} from '../level';

interface IDeathSpawnObject {
    file: string;// Path to toml file that contains the object
    chance: number;
}

interface IDeathSpawnData {
    objects: {[key: string]: IDeathSpawnObject};
    spawnSpreadRadius: number;
}

export default class DeathSpawn implements IComponent {
    data: IDeathSpawnData;
    owner: Entity;

    constructor(data: IDeathSpawnData, owner: Entity) {
        this.data = data;
        this.owner = owner;
        function spawnEntities(other: any) {
            console.log('spawning entities for dead thing');
            Object.keys(this.data.objects).forEach(key => {
                const objectData: IDeathSpawnObject = this.data.objects[key];
                if(Math.random() <= objectData.chance) {
                    const entityData = require(`../toml/${objectData.file}`);
                    const ent = new Entity(entityData);
                    ent.position.x = owner.position.x + (Math.random() - 0.5) * this.data.spawnSpreadRadius;
                    ent.position.y = owner.position.y + (Math.random() - 0.5) * this.data.spawnSpreadRadius;
                    ent.position.z = owner.position.z;
                    console.log(`spawning ${objectData.file} at ${ent.position.x}, ${ent.position.y}`);

                    let sender: Entity;
                    if(this.owner.parent instanceof Entity) sender = this.owner.parent;
                    else sender = this.owner;

                    ent.sharedData.sender = sender;

                    levelManager.currentLevel.addEntity(ent);
                }
            });
        }

        this.owner.on('died', spawnEntities.bind(this));
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

    update(dt) {
        return;
    }
}
