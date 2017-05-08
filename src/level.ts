import * as THREE from 'three';
import {TerrainFactory, Terrain} from './terrain';
import Entity from './entity';

interface ILoadTerrainParameters {
    filename: string;
}

interface IGenTerrainParameters {
    width: number;
    height: number;
}

interface IPoint {
    x: number;
    y: number;
}

interface IEntityData {
    tomlFile: string;
    position: IPoint;
}

interface ILevelData {
    terrainGenMethod: string;
    terrainGenParams: ILoadTerrainParameters | IGenTerrainParameters;
    entities: IEntityData[];
}

export default class Level extends THREE.Object3D {
    data: ILevelData;

    terrain: Terrain;
    entities: Entity[];

    constructor(data: ILevelData) {
        super();
        this.data = data;
        this.entities = [];
    }

    spawnEntities() {
        if(this.data.terrainGenMethod !== undefined) {
            this.terrain = TerrainFactory[this.data.terrainGenMethod](this.data.terrainGenParams);
            this.terrain.SpawnLevel();
            this.add(this.terrain);
        }
        this.data.entities.forEach(ent => {
            console.log(ent.tomlFile);
            const entityData = require(`./toml/${ent.tomlFile}`);
            const entity = new Entity(entityData);
            entity.position.x = ent.position.x;
            entity.position.y = ent.position.y;
            this.add(entity);
            this.entities.push(entity);
        });
    }

    update(dt: number) {
        this.entities.forEach(ent => {
            ent.update(dt);
        });
    }
}
