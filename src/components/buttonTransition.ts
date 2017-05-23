import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';
import {keyboard} from '../lib/input';

interface IButtonTransitionData {
    button: string;
    targetLevel: string;
}

export default class ButtonTransition implements IComponent {
    data: IButtonTransitionData;
    mesh: THREE.Mesh;

    constructor(data: IButtonTransitionData, owner: Entity) {
        this.data = data;
    }
    destroy(){
        
    }

    update(dt: number) {
        if(keyboard.rawKeys[this.data.button]) {
            levelManager.loadLevel(this.data.targetLevel);
        }
    }
}
