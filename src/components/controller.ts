import * as THREE from 'three';
import {keys, mouse} from '../lib/input';

import Entity from '../entity';
import {IComponent} from './component';

interface IControllerData {
    moveSpeed: number;
}

interface IController {
    GetDesiredMove: ()=> THREE.Vector2;
    GetDesiredLook: ()=> THREE.Vector2;
    GetWeaponFire: ()=> THREE.Vector2;
}

export default class Controller implements IComponent, IController {
    data: IControllerData;
    owner: Entity;

    constructor(data: IControllerData, owner: Entity) {
        this.data = data;
        this.owner = owner;
        console.log('built controller');
    }

    GetDesiredMove(): THREE.Vector2 {
        const inputVec = new THREE.Vector2();

        if(keys.w) inputVec.y += 1;
        if(keys.s) inputVec.y -= 1;
        if(keys.a) inputVec.x -= 1;
        if(keys.d) inputVec.x += 1;

        return inputVec;
    }

    GetDesiredLook(): THREE.Vector2 {
        return this.GetDesiredMove();
    }
    GetWeaponFire(): THREE.Vector2 {
        return this.GetDesiredMove();
    }

    update(dt: number) {
        const desiredMove = this.GetDesiredMove();
        const desiredLook = this.GetDesiredLook();

        const nextPos = new THREE.Vector2().copy(desiredMove);
        nextPos.multiplyScalar(this.data.moveSpeed * dt);

        this.owner.position.add(new THREE.Vector3(nextPos.x, nextPos.y, 0));
    }
}
