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
    terrainCreationMethod: string;
    terrainParams: ILoadTerrainParameters | IGenTerrainParameters;
    entities: IEntityData[];
}

export class Level extends THREE.Object3D {
    data: ILevelData;

    terrain: Terrain;
    entities: Entity[];

    constructor(data: ILevelData) {
        super();
        this.data = data;
        this.entities = [];
    }

    spawnEntities() {
        if(this.data.terrainCreationMethod !== undefined) {
            console.log(`spawning terrain ${this.data.terrainCreationMethod}`);
            this.terrain = TerrainFactory[this.data.terrainCreationMethod](this.data.terrainParams);
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

    getEntityByLabel(label: string) {
        return this.entities.find(ent => ent.label === label);
    }

    addEntity(ent: Entity) {
        this.entities.push(ent);
        this.add(ent);
    }

    removeEntity(ent: Entity) {
        this.remove(ent);
        this.entities.splice(this.entities.indexOf(ent), 1);
    }

    update(dt: number) {
        this.entities.forEach(ent => {
            ent.update(dt);
        });
    }
}

export class LevelManager {
    currentLevel: Level;
    scene: THREE.Scene;
    levelMap: any;

    init(scene: THREE.Scene) {
        this.scene = scene;
        this.levelMap = [];
    }

    addLevel(levelName: string, levelData: ILevelData) {
        this.levelMap[levelName] = levelData;
    }

    loadLevel(levelName: string) {
        this.currentLevel = new Level(this.levelMap[levelName]);
        this.scene.children = [];
        this.currentLevel.spawnEntities();
        this.scene.add(this.currentLevel);
    }

    update(dt: number) {
        if(this.currentLevel) {
            this.currentLevel.update(dt);
        }
    }
}

export const levelManager = new LevelManager();
