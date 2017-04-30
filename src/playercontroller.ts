import * as THREE from 'three';
import {keys, mouse} from './lib/input';

export interface IController {
    GetDesiredMove: ()=> THREE.Vector2;
    GetDesiredLook: ()=> THREE.Vector2;
}

export class PlayerController implements IController {
    
    GetDesiredMove() {
        const inputVec = new THREE.Vector2();

        if(keys.w) inputVec.y += 1;
        if(keys.s) inputVec.y -= 1;
        if(keys.a) inputVec.x -= 1;
        if(keys.d) inputVec.x += 1;

        return inputVec;
    }

    GetDesiredLook() {
        return this.GetDesiredMove();
    }
}

