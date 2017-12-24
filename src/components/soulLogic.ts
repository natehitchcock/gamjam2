import Collider from './collider';
import Sprite from './sprite';
import { IComponent } from "./component";
import Entity from "../entity";
import * as THREE from "three";
import { mouse } from "../lib/input";
import weaponLogic from './weaponLogic';
import {levelManager} from '../level';

export default class SoulLogic implements IComponent {
    owner: Entity;

    constructor(data: any, owner: Entity) {
        // this.data = data; No data yet
        this.owner = owner;
        function resolveSoulCollision(other: any) {
            if(other !== owner && other !== this.owner.sharedData.sender) {
                const ent = (other as Entity);
                if( ent.components
                && ent.components.find(comp => comp.type === 'bullet' || comp.type === 'soul')) {
                    return;
                }

                levelManager.currentLevel.removeEntity(this.owner);
            }
        }

        this.owner.on('collided', resolveSoulCollision.bind(this));
    }

    initialize() {
        return;
    }

    destroy() {
        return;
    }

    update(dt) {
        return;
    }
}
