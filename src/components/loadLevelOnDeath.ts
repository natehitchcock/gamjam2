import { IComponent } from "./component";
import Entity from "../entity";
import * as THREE from "three";
import {levelManager} from '../level';

interface ILoadLevelOnDeathData {
    levelToLoad: string;
}

export default class LoadLevelOnDeathData implements IComponent {
    data: ILoadLevelOnDeathData;
    owner: Entity;

    constructor(data: ILoadLevelOnDeathData, owner: Entity) {
        this.data = data;
        this.owner = owner;

        this.owner.on('died', () => { levelManager.loadLevel(this.data.levelToLoad); }, this);
    }

    initialize() {
        return;
    }

    uninitialize() {
        return;
      }

    destroy() {
        return;
    }

    update(dt) {
        return;
    }
}
