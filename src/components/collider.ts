import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';

const allColliders: Collider[] = [];

interface IColliderData {
    blocks: boolean;
    radius: number;
}

export default class Collider implements IComponent {
    data: IColliderData;
    owner: Entity;

    constructor(data: IColliderData, owner: Entity) {
        this.data = data;
        this.owner = owner;
        allColliders.push(this);
    }

    HandleCollision(other: Collider) {
        this.owner.sendEvent('collided', other);
    }

    IsCollidingWith(other: Collider) {
        const deltaPos = new THREE.Vector3().copy(this.owner.position);
        deltaPos.sub(other.owner.position);

        const overlap = deltaPos.length() - (this.data.radius + other.data.radius);
        if( overlap < 0 ) {
            return {isColliding: true, overlap: -overlap};
        }
        return {isColliding: false, overlap: 0};
    }

    update(dt: number) {
        const entity = this;
        allColliders.forEach(other => {
            if(other === entity) {
                return;
            }

            const collisionData = entity.IsCollidingWith(other);
            if(collisionData.isColliding === true) {
                entity.HandleCollision(other);
                other.HandleCollision(entity);

                if(entity.data.blocks && other.data.blocks) {
                    const sumRadius = entity.data.radius + other.data.radius;
                    const deltaVec = new THREE.Vector3().copy(entity.owner.position).sub(other.owner.position);
                    const entityResolve = new THREE.Vector3()
                        .copy(deltaVec)
                        .normalize()
                        .multiplyScalar(collisionData.overlap/2);
                    const otherResolve = new THREE.Vector3()
                        .copy(deltaVec)
                        .normalize()
                        .multiplyScalar(-collisionData.overlap/2);
                    entity.owner.position.copy(entityResolve.add(entity.owner.position));
                    other.owner.position.copy(otherResolve.add(other.owner.position));
                }
            }
        });
    }
}
