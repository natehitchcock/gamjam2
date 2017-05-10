import { IComponent } from "./component";
import Entity from "../entity";
import { mouse, keys } from "../lib/input";
import * as THREE from "@types/three";

interface IWeaponData {
  fireRate: number;
}

export default class WeaponLogic implements IComponent{
    update: (dt: number) => void;
    data: IWeaponData;
    fireRate: number;
    bulletSpeed: number;
    realTime: number; 
    playerReference: Entity;
    bulletsFired: any[];
    position: any;
    
    constructor(data: IWeaponData, owner: Entity) {
        this.data = data; 
        this.bulletsFired = [];
    }

    spawn(dt: number) {
        this.fireRate += dt;

        if ((mouse.left || keys[' ']) && this.fireRate > this.fireRate) {
            const bullet = require('./toml/bullet.toml')
            const firedBullet = new Entity(bullet);
            const newPosition = new THREE.Vector3();
            newPosition.copy(this.playerReference.position);
            this.bulletsFired.push(firedBullet);
            firedBullet.position.copy(newPosition.add(this.position));
            this.fireRate += 0;
            this.bulletsFired.forEach((bulletsFired) => {
                bulletsFired.update(dt);
            }
        }
        
    }
}