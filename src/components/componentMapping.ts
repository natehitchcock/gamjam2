import Sprite from './sprite';
import Controller from './controller';
import Collider from './collider';
import Sway from './movement/sway';
import ButtonTransition from './buttonTransition';
import Inventory from './inventory';
import Camera from './camera';
import {Follow} from './movement/follow';
import WeaponLogic from './weaponLogic';
import BulletLogic from './bulletLogic';
import SoulLogic from './soulLogic';
import DeathSpawn from './deathSpawn';
import Stats from './stats';
import Hud from './hud';
import Spritelight from './spritelight';
import TargetAcquisition from './targetAcquisition';
import FlickMelee from './flickMelee';
import orbitTarget from './movement/orbitTarget';
import Interactor from './interactor';
import LevelChangeIact from './interactions/levelChangeIact';
import LevelGenIact from './interactions/levelGenIact';
import Item from './item';
import LoadLevelOnDeath from './loadLevelOnDeath';
import DepthControl from './depthControl';
import DamageOnCollision from './damageOnCollision';

import Entity from '../entity';

export default {
    sprite: (data: any, owner: Entity) => new Sprite(data,owner),
    controller: (data: any, owner: Entity) => new Controller(data,owner),
    collider: (data: any, owner: Entity) => new Collider(data,owner),
    sway: (data: any, owner: Entity) => new Sway(data,owner),
    buttonTransition: (data: any, owner: Entity) => new ButtonTransition(data,owner),
    inventory: (data: any, owner: Entity) => new Inventory(data,owner),
    camera: (data: any, owner: Entity) => new Camera(data,owner),
    follow: (data: any, owner: Entity) => new Follow(data,owner),
    weapon: (data: any, owner: Entity) => new WeaponLogic(data, owner),
    bullet: (data: any, owner: Entity) => new BulletLogic(data, owner),
    stats: (data: any, owner: Entity) => new Stats(data, owner),
    hud: (data: any, owner: Entity) => new Hud (data, owner),
    spritelight: (data: any, owner: Entity) => new Spritelight (data, owner),
    targetAcquisition: (data: any, owner: Entity) => new TargetAcquisition (data, owner),
    interactor: (data: any, owner: Entity) => new Interactor(data, owner),
    levelChangeIact: (data: any, owner: Entity) => new LevelChangeIact(data, owner),
    levelGenIact: (data: any, owner: Entity) => new LevelGenIact(data, owner),
    soul: (data: any, owner: Entity) => new SoulLogic(data, owner),
    deathSpawn: (data: any, owner: Entity) => new DeathSpawn(data, owner),
    flickMelee: (data: any, owner: Entity) => new FlickMelee(data, owner),
    orbitTarget: (data: any, owner: Entity) => new orbitTarget(data, owner),
    item: (data: any, owner: Entity) => new Item(data, owner),
    loadLevelOnDeath: (data: any, owner: Entity) => new LoadLevelOnDeath(data, owner),
    depthControl: (data: any, owner: Entity) => new DepthControl(data, owner),
    damageOnCollision: (data: any, owner: Entity) => new DamageOnCollision(data, owner),
};
