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
    oneOf: {[key: string]: IDeathSpawnObject[]};
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
            
            if(this.data.objects) {
                Object.keys(this.data.objects).forEach(key => {
                    const objectData: IDeathSpawnObject = this.data.objects[key];
                    if(Math.random() <= objectData.chance) {
                        this.SpawnEntity(objectData.file);
                    }
                });
            }

            if(this.data.oneOf) {
                Object.keys(this.data.oneOf).forEach(key => {
                    console.log('spawning one item from the category' + key);
                    const arr: IDeathSpawnObject[] = this.data.oneOf[key];

                    if(arr === undefined) return;

                    let totalChance = 0;

                    arr.forEach(item => {
                        totalChance += item.chance;
                    });

                    const selectedChance = Math.random() * totalChance;
                    let selected: IDeathSpawnObject;

                    let currChanceIdx = 0;
                    arr.forEach(item => {
                        if(selected !== undefined) return;

                        if(selectedChance <= currChanceIdx + item.chance) {
                            selected = item;
                        }

                        currChanceIdx += item.chance;
                    });

                    if(selected) {
                        this.SpawnEntity(selected.file);
                    }
                });
            }
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

    private SpawnEntity(tomlFile: string) {
        const entityData = require(`../toml/${tomlFile}`);
        const ent = new Entity(entityData);
        ent.position.x = this.owner.position.x + (Math.random() - 0.5) * this.data.spawnSpreadRadius;
        ent.position.y = this.owner.position.y + (Math.random() - 0.5) * this.data.spawnSpreadRadius;
        ent.position.z = this.owner.position.z;
        console.log(`spawning ${tomlFile} at ${ent.position.x}, ${ent.position.y}`);

        let sender: Entity;
        if(this.owner.parent instanceof Entity) sender = this.owner.parent;
        else sender = this.owner;

        ent.sharedData.sender = sender;

        levelManager.currentLevel.addEntity(ent);
    }
}
