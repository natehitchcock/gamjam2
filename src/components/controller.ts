import * as THREE from 'three';
import * as InputManager from '../lib/input';

import Entity from '../entity';
import { IComponent } from './component';

interface IControllerData {
  moveSpeed: number;
  dodgeTime: number;
  dodgeDistance: number;
}

interface IController {
  GetDesiredMove: () => THREE.Vector2;
  GetDesiredLook: () => THREE.Vector2;
  GetWeaponFire: () => THREE.Vector2;
}

export default class Controller implements IComponent {
  data: IControllerData;
  owner: Entity;
  move: THREE.Vector2;
  look: THREE.Vector2;
  gamepadActive: boolean;
  dodgeStartTimer: number;
  myClock: THREE.Clock;
  dodgeDirection: THREE.Vector2;
  dodgeStartPosition: THREE.Vector2;
  wantToFire: boolean = false;

  constructor(data: IControllerData, owner: Entity) {
    this.data = data;
    this.owner = owner;
    this.move = new THREE.Vector2();
    this.look = new THREE.Vector2();
    this.myClock = new THREE.Clock();

    this.dodgeDirection = undefined;
    this.dodgeStartPosition = undefined;
    this.dodgeStartTimer = undefined;

    InputManager.on('forward', value => (this.move.y += value), this);
    InputManager.on('right', value => (this.move.x += value), this);
    InputManager.on('lookforward', value => (this.look.y = value), this);
    InputManager.on('lookright', value => (this.look.x = value), this);
    InputManager.on(
      'dodge',
      value => {
        if (value > 0.1 && this.dodgeStartTimer === undefined) {
          this.dodgeStartTimer = this.myClock.getElapsedTime();
        }
      },
      this,
    );
    InputManager.on(
      'fire',
      value => {
        if (value > 0.1) {
          this.wantToFire = true;
        }
      },
      this,
    );
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

    if (this.shouldBeDodging()) {
      this.dodgeOwner(desiredMove);
    } else {
      this.resetDodge();

      this.moveOwner(desiredMove, dt);
    }

    this.lookOwner(desiredLook, dt);

    if (this.wantToFire) {
      this.owner.sendEvent(
        'fire',
        this.owner.sharedData.look
          ? this.owner.sharedData.look.clone()
          : undefined,
        true,
      );

      this.wantToFire = false;
    }
  }

  shouldBeDodging() {
    return (
      this.dodgeStartTimer !== undefined &&
      this.data.dodgeTime !== undefined &&
      this.myClock.getElapsedTime() - this.dodgeStartTimer <=
        this.data.dodgeTime
    );
  }

  moveOwner(desiredMove: THREE.Vector2, dt: number) {
    const nextPos = new THREE.Vector2().copy(desiredMove);
    nextPos.multiplyScalar(this.data.moveSpeed * dt);
    this.owner.sharedData.nextMove = new THREE.Vector3(nextPos.x, nextPos.y, 0);
  }

  dodgeOwner(desiredMove: THREE.Vector2) {
    if (this.dodgeDirection === undefined) {
      if (desiredMove.length() <= 0.01) {
        this.resetDodge();
        return;
      }

      this.owner.sendEvent('dodgeStart');
      this.dodgeDirection = desiredMove.clone();
      this.dodgeStartPosition = new THREE.Vector2(
        this.owner.position.x,
        this.owner.position.y,
      );
    }

    const dodgeSpeed = this.data.dodgeDistance / this.data.dodgeTime;
    const dodgeElapsedTime =
      this.myClock.getElapsedTime() - this.dodgeStartTimer;

    const targetPosition = this.dodgeDirection
      .clone()
      .normalize()
      .multiplyScalar(dodgeSpeed * dodgeElapsedTime)
      .add(this.dodgeStartPosition)
      .sub(new THREE.Vector2(this.owner.position.x, this.owner.position.y));

    if (this.data.dodgeTime - dodgeElapsedTime <= 0.03) {
      this.owner.sharedData.nextMove = new THREE.Vector3(0, 0, 0);
    } else {
      this.owner.sharedData.nextMove = new THREE.Vector3(
        targetPosition.x,
        targetPosition.y,
        0,
      );
    }
  }

  resetDodge() {
    if (this.dodgeStartTimer !== undefined) {
      this.dodgeDirection = undefined;
      this.dodgeStartPosition = undefined;
      this.dodgeStartTimer = undefined;

      this.owner.sendEvent('dodgeEnd');
    }
  }

  lookOwner(desiredLook: THREE.Vector2, dt: number) {
    this.owner.sharedData.rawLastLook = this.owner.sharedData.rawLook;
    this.owner.sharedData.rawLook = desiredLook.clone();

    this.owner.sharedData.lastLook = this.owner.sharedData.look
      ? this.owner.sharedData.look.clone()
      : undefined;

    if (desiredLook.length() > 0.3) {
      this.owner.sharedData.look = desiredLook.normalize().clone();
    } else {
      this.owner.sharedData.look = new THREE.Vector2(0, 0);
    }
  }
}
