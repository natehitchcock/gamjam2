import {IComponent} from '../component';
import Entity from '../../entity';
import {Level, spawnEnemies, spawnExit, spawnEntry, levelManager} from '../../level';

interface ILevelGenIactData {
    destLevel: string;
    enemyPointsToSpend: number;
}

export default class LevelGenIact implements IComponent {
    data: ILevelGenIactData;
    owner: Entity;

    constructor(data: ILevelGenIactData, owner: Entity) {
        this.data = data;
        this.owner = owner;
    }

    initialize() {
        this.owner.on('interact', data => {
            levelManager.loadLevel(this.data.destLevel, true);
            const entry = spawnEntry(levelManager.currentLevel, 120);
            spawnEnemies(this.data.enemyPointsToSpend, [{
                chance: 1,
                collisionRadius: 60,
                entityFile: 'entities/stalker.toml',
                isolationRadius: 200,
                pointWorth: 5,
            },
            {
                chance: 5,
                collisionRadius: 60,
                entityFile: 'entities/peeper.toml',
                isolationRadius: 200,
                pointWorth: 1,
            },
            {
                chance: 0.1,
                collisionRadius: 60,
                entityFile: 'chest.toml',
                isolationRadius: 500,
                pointWorth: 1,
            }], levelManager.currentLevel, [{isolationRadius: 300, position: entry.position}]);
            spawnExit(levelManager.currentLevel, 60);
        }, this);
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
