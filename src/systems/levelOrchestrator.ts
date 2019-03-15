import {IComponent} from '../components/component';
import Entity from '../entity';
import {Level, spawnEnemies, attemptSpawn, levelManager} from '../level';

class EnemyDataItem {
    tomlFile: string;
    chance: number;
    collisionRadius: number;
    isolationRadius: number;
    pointWorth: number;
    age: number;
    insight: number;
}

class EnemyDataFile {
    enemies: EnemyDataItem[];
}

class LevelData {
    terrainSet: string;
    decorumSet: string;
    enemies: EnemyDataItem[];
}

export default class LevelOrchestrator {
    public static Initialize() {

        // Pick 3 level sets
        // Pick enemies
        const enemyData: EnemyDataFile = require(`../toml/enemyInfo.toml`);
        LevelOrchestrator.levelSetInfo.push({
            terrainSet: 'NA',
            decorumSet: 'NA',
            enemies: enemyData.enemies,
        });

        // Pick items/modifiers
        // Pick decorum set

        LevelOrchestrator.initilaized = true;
    }

    public static GenerateLevel(baseLevel: string, depth: number) {

        if(LevelOrchestrator.initilaized === false) {
            LevelOrchestrator.Initialize();
        }

        const spawnedList: Array<{position: THREE.Vector3, isolationRadius: number}> = [];

        // Spawn terrain
        levelManager.loadLevel(baseLevel, true);

        // Spawn Entry
        const level = levelManager.currentLevel;
        const entry = attemptSpawn(level, 'world/playerEntry.toml', 120, 120, 150);

        if(entry === undefined) {
            // Retry level generation, or cut a hole in the level or something
        }

        spawnedList.push({
            position: entry.position,
            isolationRadius: 300,
        });

        // Spawn Exit
        const exit = attemptSpawn(level, 'world/gateway.toml', 60, 60, 150);

        if(exit === undefined) {
            // Retry generation
        }

        exit.sharedData.depth = depth + 1;

        spawnedList.push({
            position: exit.position,
            isolationRadius: 60,
        });

        // Spawn Chests

        const chestCount = Math.random() * 4;
        for(let i = 0; i < chestCount; ++i) {
            const chest = attemptSpawn(level, 'chest.toml', 200, 60, 150);

            if(chest !== undefined) {
                spawnedList.push({
                    position: chest.position,
                    isolationRadius: 200,
                });
            }
        }

        // Spawn Vaults
        // Spawn Altars

        // spawnVaults(levelManager.currentLevel);
        // spawnAltars(levelManager.currentLevel);

        // Spawn Enemies

        const pointsToSpend = LevelOrchestrator.startingPoints + Math.pow(LevelOrchestrator.scalePerDepth, depth);
        const enemySpawnData = LevelOrchestrator.levelSetInfo[0].enemies.map(enemy => {
            return {
                chance: enemy.chance,
                collisionRadius: enemy.collisionRadius,
                entityFile: enemy.tomlFile,
                isolationRadius: enemy.isolationRadius,
                pointWorth: enemy.pointWorth,
            };
        });

        spawnEnemies(pointsToSpend,
            enemySpawnData,
            levelManager.currentLevel,
            spawnedList);

        // Spawn Decor
        // spawnDecor();
    }

    private static startingPoints: number = 50;
    private static scalePerDepth: number = 1.3;
    private static levelSetInfo: LevelData[] = [];
    private static initilaized: boolean = false;
}
