import {IComponent} from '../component';
import Entity from '../../entity';
import {Level, spawnEnemies, spawnExit, levelManager} from '../../level';

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
            levelManager.loadLevel(this.data.destLevel);
            spawnEnemies(this.data.enemyPointsToSpend, [{
                chance: 1,
                collisionRadius: 60,
                entityFile: 'testenemy.toml',
                isolationRadius: 200,
                pointWorth: 1,
            }], levelManager.currentLevel);
            spawnExit(levelManager.currentLevel, 60);
        }, this);
    }

    destroy() {
        return;
    }

    update(dt: number) {
        return;
    }
}
