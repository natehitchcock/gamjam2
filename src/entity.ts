import * as THREE from 'three';
import {IComponent} from './components/component';
import ComponentMapping from './components/componentMapping';
import {PlayerController, IController} from './playercontroller';

interface ICollisionData {
    blocks: boolean;
    radius: number;
}

export default class Entity extends THREE.Object3D {
    collision: ICollisionData;
    data: any;

    components: IComponent[];

    constructor(data: any) {
        super();
        this.data = data;

        this.components = [];
        for(const prop in data) {
            if(prop) {
                const comp = ComponentMapping[prop](data[prop], this);
                this.components.push(comp);
            }
        }
    }

    update(dt) {
        this.components.forEach((comp)=>comp.update(dt));
    }

    HandleCollision(other: Entity) {
        return;
    }

    IsCollidingWith(other: Entity) {
        if(this.collision === undefined
        || other.collision === undefined) {
            return {isColliding: false, overlap: 0};
        }

        const deltaPos = new THREE.Vector3().copy(this.position);
        deltaPos.sub(other.position);

        const overlap = deltaPos.length() - (this.collision.radius + other.collision.radius);
        if( overlap < 0 ) {
            return {isColliding: true, overlap: -overlap};
        }
        return {isColliding: false, overlap: 0};
    }
}