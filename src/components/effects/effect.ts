import * as THREE from 'three';
import Entity from '../../entity';
import { IComponent } from '../component';
import { levelManager } from '../../level';

export interface IEffectData {
  onEvent: string;
}

export class Effect implements IComponent {
  data: IEffectData;
  owner: Entity;
  target: Entity;

  constructor(data: IEffectData, owner: Entity) {
    this.data = data;
    this.owner = owner;
  }

  activate() {
    console.log('activated');
    return;
  }

  initialize() {
    if (this.data.onEvent) {
      this.owner.on(this.data.onEvent, this.activate, this);
    }
    return;
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
