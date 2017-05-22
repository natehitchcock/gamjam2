import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';

const allColliders: Collider[] = [];

interface IColliderData {
    blocks: boolean;
    radius: number;
}

export default class Collider implements IComponent {
    data: IColliderData;
    owner: Entity;
    lastPosition: THREE.Vector3;
    deleted: boolean;

    constructor(data: IColliderData, owner: Entity) {
        this.data = data;
        this.deleted = false;
        this.owner = owner;
        this.lastPosition = new THREE.Vector3().copy(owner.position);
        allColliders.push(this);
        console.log('bullet spawned');
    }
    destroy() {
        console.log('destroyed bullet');
        this.deleted = true;
        delete allColliders[allColliders.indexOf(this)];
    }

    HandleCollision(other: Collider) {
        this.owner.sendEvent('collided', other.owner);
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
        if(this.deleted) return;

        // Entity to entity collision
        allColliders.forEach(other => {
            if(other === entity
            || other === undefined
            || other.deleted) {
                if(other.deleted) console.log('deleted');
                return;
            }

            const collisionData = entity.IsCollidingWith(other);
            if(collisionData.isColliding === true) {
                console.log('collided');
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

        if(this.owner.sharedData.nextMove) {
            const nextLocation = new THREE.Vector3().copy(this.owner.position).add(this.owner.sharedData.nextMove);
            const collisionData = levelManager.currentLevel.terrain
                .SphereCollisionLineTest(this.owner.position, nextLocation, this.data.radius);

            if(collisionData.tVal < 1) {
                console.log('tink');
                const deltaPos = new THREE.Vector3().copy(this.owner.sharedData.nextMove);
                deltaPos.multiplyScalar(collisionData.tVal);
                this.owner.position.add(deltaPos);
                this.owner.sharedData.nextMove = new THREE.Vector3();
            }
            this.lastPosition.copy(this.owner.position);
        }
    }
}
