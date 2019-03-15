import * as THREE from 'three';
import {TerrainFactory, Terrain, tileSize} from './terrain';
import Entity from './entity';
import Camera from './components/camera';
import {IComponent} from './components/component';

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
    usePixelShader: boolean;
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
    private addList: Entity[];

    constructor(data: ILevelData) {
        super();
        this.data = data;
        this.entities = [];
        this.removeList = [];
        this.addList = [];
    }

    spawnEntities() {
        if(this.data.terrainCreationMethod !== undefined) {
            console.log(`spawning terrain ${this.data.terrainCreationMethod}`);
            this.terrain = TerrainFactory[this.data.terrainCreationMethod](this.data.terrainParams);
            this.terrain.SpawnLevel();
            this.add(this.terrain);
        }
        this.data.entities.forEach(ent => {
            let entityData: any;
            if(ent.tomlFile !== undefined) {
                console.log(ent.tomlFile);
                entityData = require(`./toml/${ent.tomlFile}`);
            }

            const entity = new Entity(entityData, ent.label);
            entity.sharedData.tomlFile = ent.tomlFile;
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

    getAllComponents(type: string) {
        const comps = new Array<IComponent>();
        this.entities.forEach(ent => {
            const comp = ent.getComponent(type);
            if(comp) {
                comps.push(comp);
            }
        });

        return comps;
    }

    getEntityByLabel(label: string) {
        const found = this.entities.find(ent => ent && ent.label === label);
        return found;
    }

    getEntitiesByLabel(label: string) {
        const found = this.entities.filter(ent => ent && ent.label === label);
        return found;
    }

    addEntity(ent: Entity) {
        this.addList.push(ent);
    }

    movePersistentEntitiesFrom(oldLevel: Level) {
        const removeList = [];
        oldLevel.entities.forEach(ent => {
            if(ent.persistent) {
                removeList.push(ent);
            }
        });

        removeList.forEach(ent => {
            if(ent.parent === oldLevel) {
                oldLevel.remove(ent);
                ent.parent = this;
                this.add(ent);
            }

            oldLevel.entities.splice(oldLevel.entities.indexOf(ent), 1);

            console.log(`moving over persistent object ${ent.tomlFile} [${ent.label}]`);

            this.entities.push(ent);
        });

        this.entities.forEach(ent => ent.initialize());
    }

    removeEntity(ent: Entity) {
        this.removeList.push(ent);
    }

    removeAllEntities(immediate?: boolean) {
        this.addList = [];

        this.removeList.push(... this.entities);

        if(immediate) {
            this.removeList.forEach(ent => this.internal_removeEntity(ent, true));
        }
    }

    update(dt: number) {
        this.addList.forEach(ent => this.internal_addEntity(ent));
        this.addList = [];

        this.entities.forEach(ent => {
            ent.update(dt);
        });

        this.removeList.forEach(ent => this.internal_removeEntity(ent, true));
        this.removeList = [];
    }

    getActiveCamera(): THREE.Camera {
        const camEnt = this.getEntityByLabel("activeCam");
        const camComp = camEnt.components.find(comp => comp instanceof Camera) as Camera;
        return camComp.camera;
    }

    private internal_addEntity(ent: Entity) {
        this.entities.push(ent);
        ent.parent = this;
        this.add(ent);
        ent.initialize();
    }

    private internal_removeEntity(ent: Entity, overridePersistence: boolean = false) {
        if(ent && (!ent.persistent || overridePersistence)) {
            console.log('removing ' + ent.sharedData.tomlFile);
            ent.uninitialize();
            this.remove(ent);
            ent.destroy();
            delete ent.parent;
            const entIdx = this.entities.indexOf(ent);
            if(entIdx >= 0) {
                this.entities.splice(entIdx, 1);
            }
        }
    }
}

export class LevelManager {
    currentLevel: Level;
    scene: THREE.Scene;
    levelMap: any;
    loadLevelFns: Array<()=>void>;

    private nextLevel: string = undefined;

    constructor() {
        this.loadLevelFns = [];
    }

    init(scene: THREE.Scene) {
        this.scene = scene;
        this.levelMap = [];
    }

    addLevel(levelName: string, levelData: ILevelData) {
        this.levelMap[levelName] = levelData;
    }

    onLevelLoad(fn: ()=>void) {
        this.loadLevelFns.push(fn);

        if(this.currentLevel !== undefined) {
            fn();
        }
    }

    loadLevel(levelName: string, immediate: boolean = false) {
        this.nextLevel = levelName;

        if(immediate) {
            this.loadLevel_internal();
            this.nextLevel = undefined;
        }
    }

    update(dt: number) {
        if(this.currentLevel) {
            this.currentLevel.update(dt);
        }

        if(this.nextLevel !== undefined) {

            this.loadLevel_internal();

            this.nextLevel = undefined;
        }
    }

    private loadLevel_internal() {
        console.log(`loading level ${this.nextLevel}`);
        const newLevel = new Level(this.levelMap[this.nextLevel]);

        this.scene.children = [];
        if(this.currentLevel != null) {
            newLevel.movePersistentEntitiesFrom(this.currentLevel);
            this.currentLevel.removeAllEntities(true);
        }

        this.currentLevel = newLevel;
        this.currentLevel.spawnEntities();
        this.scene.add(this.currentLevel);

        // Call load level functions
        this.loadLevelFns.forEach(fn => fn());
    }
}

export const levelManager = new LevelManager();

export interface IEnemyDeadZones {
    position: THREE.Vector3;
    isolationRadius: number;
}

export interface IEnemySpawnData {
    entityFile: string;
    pointWorth: number;
    chance: number;
    collisionRadius: number;
    isolationRadius: number;
}

export function spawnEnemies(
    pointsToSpend: number,
    enemies: IEnemySpawnData[],
    level: Level,
    deadZones?: IEnemyDeadZones[]) {

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
                Math.random() * terrain.dimensions.x * tileSize.x,
                Math.random() * terrain.dimensions.y * tileSize.x,
                0);

            let farEnoughAway = true;
            if(deadZones) {
                deadZones.forEach(zone => {
                    const zoneFlatPos = new THREE.Vector3(zone.position.x, zone.position.y, 0);
                    if(zoneFlatPos.distanceTo(loc) <= selected.isolationRadius) {
                        farEnoughAway = false;
                    }
                });
            }

            if(farEnoughAway) {
                placedEntities.forEach(ent => {
                    const entFlatPos = new THREE.Vector3(ent.position.x, ent.position.y, 0);
                    if(entFlatPos.distanceTo(loc) <= selected.isolationRadius) {
                        farEnoughAway = false;
                    }
                });
            }

            if(farEnoughAway
            && terrain.SphereCollisionTest(
                loc,
                selected.collisionRadius,
            ).collisionDetected === false) {
                console.log('placed entity');
                const entityData = require(`./toml/${selected.entityFile}`);
                const spawned = new Entity(entityData);
                spawned.position.x = loc.x;
                spawned.position.y = loc.y;
                spawned.position.z = 64-loc.y;
                level.addEntity(spawned);
                pointsToSpend -= selected.pointWorth;
                placed = true;
            }
        }
    }
}

// [TODO] parameterize toml file and number of retried for placement
// [TODO] better fail state for not being able to place the exit portal
export function spawnExit(level: Level, exitCollisionRadius: number) {

    const terrain = level.terrain;
    for(let i = 0; i < 150; ++i) {
        const loc = new THREE.Vector3(
            Math.random() * terrain.dimensions.x * tileSize.x,
            Math.random() * terrain.dimensions.y * tileSize.x,
            0);

        if(terrain.SphereCollisionTest(
                loc,
                exitCollisionRadius,
            ).collisionDetected === false) {
            const entityData = require(`./toml/world/gateway.toml`);
            const spawned = new Entity(entityData);
            spawned.position.x = loc.x;
            spawned.position.y = loc.y;
            level.addEntity(spawned);
            return;
        }
    }

    console.error('couldnt place exit portal');
}

export function spawnEntry(level: Level, exitCollisionRadius: number) {
    const terrain = level.terrain;
    for(let i = 0; i < 150; ++i) {
        const loc = new THREE.Vector3(
            Math.random() * terrain.dimensions.x * tileSize.x,
            Math.random() * terrain.dimensions.y * tileSize.x,
            0);

        if(terrain.SphereCollisionTest(
                loc,
                exitCollisionRadius,
            ).collisionDetected === false) {
            const entityData = require(`./toml/world/playerEntry.toml`);
            const spawned = new Entity(entityData);
            spawned.position.x = loc.x;
            spawned.position.y = loc.y;
            level.addEntity(spawned);
            return spawned;
        }
    }

    console.error('couldnt place exit portal');
    return undefined;
}

export function attemptSpawn(
    level: Level,
    entityTomlFile: string,
    isolationRadius: number,
    collisionRadius: number,
    maxRetries: number,
    deadZones?: IEnemyDeadZones[]) {

    const terrain = level.terrain;
    for(let i = 0; i < maxRetries; ++i) {
        const loc = new THREE.Vector3(
            Math.random() * terrain.dimensions.x * tileSize.x,
            Math.random() * terrain.dimensions.y * tileSize.x,
            0);

        let farEnoughAway = true;
        if(deadZones) {
            deadZones.forEach(zone => {
                const zoneFlatPos = new THREE.Vector3(zone.position.x, zone.position.y, 0);
                if(zoneFlatPos.distanceTo(loc) <= zone.isolationRadius
                || zoneFlatPos.distanceTo(loc) <= isolationRadius) {
                    farEnoughAway = false;
                }
            });
        }

        if(farEnoughAway
        && terrain.SphereCollisionTest(
            loc,
            collisionRadius,
        ).collisionDetected === false) {
            console.log('placed entity');
            const entityData = require(`./toml/${entityTomlFile}`);
            const spawned = new Entity(entityData);
            spawned.position.x = loc.x;
            spawned.position.y = loc.y;
            spawned.position.z = 64-loc.y;
            level.addEntity(spawned);
            return spawned;
        }
    }

    return undefined;
}
