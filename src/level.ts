import * as THREE from 'three';
import {TerrainFactory, Terrain} from './terrain';
import Entity from './entity';
import Camera from './components/camera';

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
    label?: string;
    tomlFile: string;
    position: IPoint;
}

interface ILevelData {
    terrainCreationMethod: string;
    terrainTileSet: string;
    terrainParams: ILoadTerrainParameters | IGenTerrainParameters;
    entities: IEntityData[];
}

export class Level extends THREE.Object3D {
    data: ILevelData;

    terrain: Terrain;
    entities: Entity[];

    currentCamera: THREE.Camera;

    private removeList: Entity[];

    constructor(data: ILevelData) {
        super();
        this.data = data;
        this.entities = [];
        this.removeList = [];
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
            const entity = new Entity(entityData, ent.label);
            entity.position.x = ent.position.x;
            entity.position.y = ent.position.y;
            entity.parent = this;
            this.add(entity);
            this.entities.push(entity);
        });

        this.entities.forEach(ent => {
            ent.initialize();
        });

        this.currentCamera = this.getActiveCamera();
    }

    getEntityByLabel(label: string) {
        const found = this.entities.find(ent => ent.label === label);
        return found;
    }

    addEntity(ent: Entity) {
        this.entities.push(ent);
        ent.parent = this;
        this.add(ent);
    }

    removeEntity(ent: Entity) {
        this.removeList.push(ent);
    }

    update(dt: number) {
        this.entities.forEach(ent => {
            ent.update(dt);
        });

        this.removeList.forEach(ent => this.internal_removeEntity(ent));
        this.removeList = [];
    }

    getActiveCamera(): THREE.Camera {
        const camEnt = this.getEntityByLabel("activeCam");
        const camComp = camEnt.components.find(comp => comp instanceof Camera) as Camera;
        return camComp.camera;
    }

    private internal_removeEntity(ent: Entity) {
        this.remove(ent);
        ent.destroy();
        delete this.entities[this.entities.indexOf(ent)];
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

export interface IEnemySpawnData {
    entityFile: string;
    pointWorth: number;
    chance: number;
    collisionRadius: number;
    isolationRadius: number;
}
export function spawnEnemies(pointsToSpend: number, enemies: IEnemySpawnData[], level: Level) {
    let totalChance = 0;
    enemies.forEach(edat => totalChance += edat.chance);

    if(totalChance === 0) return;

    for(let j = 0; j < 300 && pointsToSpend > 0; ++j) {
        // Select and enemy to spawn
        const r = Math.random() * totalChance;
        let lchance = 0;
        let selected: IEnemySpawnData;
        enemies.forEach(edat => {
            const hchance = lchance + edat.chance;
            if(r >= lchance &&  r <= hchance) {
                selected = edat;
            }
            lchance = hchance;
        });

        // Find a good location for that enemy
        const terrain = level.terrain;
        let placed = false;
        const placedEntities: Entity[] = [];
        for(let i = 0; i < 15 && !placed; ++i) {
            const loc = new THREE.Vector3(
                Math.random() * terrain.dimensions.x,
                Math.random() * terrain.dimensions.y,
                0);

            let farEnoughAway = true;
            placedEntities.forEach(ent => {
                const entFlatPos = new THREE.Vector3(ent.position.x, ent.position.y, 0);
                if(entFlatPos.distanceTo(loc) <= selected.isolationRadius) {
                    farEnoughAway = false;
                }
            });

            if(farEnoughAway
            && terrain.SphereCollisionLineTest(loc, loc, selected.collisionRadius)) {
                const entityData = require(`./toml/${selected.entityFile}`);
                const spawned = new Entity(entityData);
                level.addEntity(spawned);
                pointsToSpend -= selected.pointWorth;
                placed = true;
            }
        }
    }
}
