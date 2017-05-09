import Sprite from './sprite';
import Controller from './controller';
import Collider from './collider';
import Sway from './sway';
import ButtonTransition from './buttonTransition';

import Entity from '../entity';

export default {
    sprite: (data: any, owner: Entity) => new Sprite(data,owner),
    controller: (data: any, owner: Entity) => new Controller(data,owner),
    collider: (data: any, owner: Entity) => new Collider(data,owner),
    sway: (data: any, owner: Entity) => new Sway(data,owner),
    buttonTransition: (data: any, owner: Entity) => new ButtonTransition(data,owner),
};
