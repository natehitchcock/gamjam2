import {IComponent} from '../component';
import Entity from '../../entity';
import {Level, spawnEnemies, levelManager} from '../../level';

interface ILevelGenIactData {
    destLevel: string;
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
            spawnEnemies(30, [{
                chance: 1,
                collisionRadius: 10,
                entityFile: 'testenemy.toml',
                isolationRadius: 60,
                pointWorth: 1,
            }], levelManager.currentLevel);
        }, this);
    }

    destroy() {
        return;
    }

    update(dt: number) {
        return;
    }
}
