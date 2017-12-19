import {IComponent} from '../component';
import Entity from '../../entity';
import {levelManager} from '../../level';

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
            levelManager.loadLevel(this.data.destLevel);
        }, this);
    }

    destroy() {
        return;
    }

    update(dt: number) {
        return;
    }
}
