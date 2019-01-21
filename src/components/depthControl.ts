import { IComponent } from "./component";
import Entity from "../entity";
import * as THREE from "three";
import {levelManager} from '../level';

interface IDepthControlData {
    zOrder: number;
}

export default class DepthControl implements IComponent {
    data: IDepthControlData;
    owner: Entity;

    constructor(data: IDepthControlData, owner: Entity) {
        this.data = data;
        this.owner = owner;
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
        this.owner.position.z = this.data.zOrder - this.owner.position.y;
    }
}
