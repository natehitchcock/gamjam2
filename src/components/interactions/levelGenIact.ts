import {IComponent} from '../component';
import Entity from '../../entity';
import {Level, spawnEnemies, spawnExit, spawnEntry, levelManager} from '../../level';
import LevelOrchestrator from '../../systems/levelOrchestrator';

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
            LevelOrchestrator.GenerateLevel(this.data.destLevel, this.owner.sharedData.depth || 0);
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
