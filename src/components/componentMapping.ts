import Sprite from './sprite';
import Controller from './controller';
import Collider from './collider';
import Sway from './sway';
import ButtonTransition from './buttonTransition';
import Inventory from './inventory';
import WeaponLogic from './weaponLogic';
import Entity from '../entity';
import BulletLogic from "./bulletLogic";

export default {
    sprite: (data: any, owner: Entity) => new Sprite(data,owner),
    controller: (data: any, owner: Entity) => new Controller(data,owner),
    collider: (data: any, owner: Entity) => new Collider(data,owner),
    sway: (data: any, owner: Entity) => new Sway(data,owner),
    buttonTransition: (data: any, owner: Entity) => new ButtonTransition(data,owner),
    inventory: (data: any, owner: Entity) => new Inventory(data,owner),
    weapon: (data: any, owner: Entity) => new WeaponLogic(data, owner),
    bullet: (data: any, owner: Entity) => new BulletLogic(data, owner),
};
