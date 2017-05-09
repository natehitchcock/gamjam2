import Collider from './collider';
import Sprite from './sprite';
import { IComponent } from "./component";

interface IBulletData {
    damageMultiplier: number;
    bulletLife: number;
}
export default class BulletLogic implements IComponent{
    data: IBulletData; 

    constructor(data: IBulletData, owner: Entity) {
        this.data = data;
    }
}

    update(dt: number) {
        return;
    }