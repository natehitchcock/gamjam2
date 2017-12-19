import * as THREE from 'three';
import * as InputManager from '../lib/input';

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

export default class Controller implements IComponent {
    data: IControllerData;
    owner: Entity;
    move: THREE.Vector2;
    look: THREE.Vector2;
    gamepadActive: boolean;

    constructor(data: IControllerData, owner: Entity) {
        this.data = data;
        this.owner = owner;
        this.move = new THREE.Vector2();
        this.look = new THREE.Vector2();

        InputManager.on('forward', value => this.move.y += value, this);
        InputManager.on('right', value => this.move.x += value, this);
        InputManager.on('lookforward', value => this.look.y += value, this);
        InputManager.on('lookright', value => this.look.x += value, this);
        InputManager.on('fire', value =>  {
            if(value > 0.1) this.owner.sendEvent('fire', this.owner.sharedData.look, true);
        }, this);
    }

    initialize() {
        return;
    }

    destroy() {
        return;
    }

    GetDesiredMove(): THREE.Vector2 {
        const inputVec = this.move.clone();
        this.move = new THREE.Vector2();
        return inputVec;
    }

    GetDesiredLook(): THREE.Vector2 {
        const inputVec = this.look.clone();
        this.look = new THREE.Vector2();
        return inputVec;
    }

    update(dt: number) {
        const desiredMove = this.GetDesiredMove();
        const desiredLook = this.GetDesiredLook();

        const nextPos = new THREE.Vector2().copy(desiredMove);
        nextPos.multiplyScalar(this.data.moveSpeed * dt);

        if(desiredLook.length() > 0.1) {
            this.owner.sharedData.look = desiredLook.normalize();
        } else {
            this.owner.sharedData.look = new THREE.Vector2(0, 0);
        }
        this.owner.sharedData.nextMove = new THREE.Vector3(nextPos.x, nextPos.y, 0);
    }
}
