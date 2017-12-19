import {IComponent} from '../component';
import Entity from '../../entity';
import {Level, spawnEnemies, levelManager} from '../../level';

interface ILevelChangeIactData {
    destLevel: string;
}

export default class LevelChangeIact implements IComponent {
    data: ILevelChangeIactData;
    owner: Entity;

    constructor(data: ILevelChangeIactData, owner: Entity) {
        this.data = data;
        this.owner = owner;
    }

    initialize() {
        this.owner.on('interact', data => {
            levelManager.loadLevel('theRoom');
            spawnEnemies(10, [{
                chance: 1,
                collisionRadius: 10,
                entityFile: 'testenemy',
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
