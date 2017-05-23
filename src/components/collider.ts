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
    collided: Collider[];

    constructor(data: IColliderData, owner: Entity) {
        this.data = data;
        this.deleted = false;
        this.owner = owner;
        this.lastPosition = new THREE.Vector3().copy(owner.position);
        this.collided = [];
        allColliders.push(this);
        console.log('bullet spawned');
    }

    initialize() {
        return;
    }

    destroy() {
        console.log('destroyed bullet');
        this.deleted = true;
        delete allColliders[allColliders.indexOf(this)];
    }

    HandleCollision(other: Collider) {
        this.collided.push(other);
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
        if(this.deleted) return;

        // Entity to entity collision
        allColliders.forEach(other => {
            if(other === this
            || other === undefined
            || other.deleted
            || this.collided.find(col => col === other)) {
                if(other.deleted) console.log('deleted');
                return;
            }

            const collisionData = this.IsCollidingWith(other);
            if(collisionData.isColliding === true) {
                this.HandleCollision(other);
                other.HandleCollision(this);

                if(this.data.blocks && other.data.blocks) {
                    const sumRadius = this.data.radius + other.data.radius;
                    const deltaVec = new THREE.Vector3().copy(this.owner.position).sub(other.owner.position);
                    const entityResolve = new THREE.Vector3()
                        .copy(deltaVec)
                        .normalize()
                        .multiplyScalar(collisionData.overlap/2);
                    const otherResolve = new THREE.Vector3()
                        .copy(deltaVec)
                        .normalize()
                        .multiplyScalar(-collisionData.overlap/2);
                    this.owner.position.copy(entityResolve.add(this.owner.position));
                    other.owner.position.copy(otherResolve.add(other.owner.position));
                }
            }
        }, this);

        if(this.owner.sharedData.nextMove) {
            const nextLocation = new THREE.Vector3().copy(this.owner.position).add(this.owner.sharedData.nextMove);
            const collisionData = levelManager.currentLevel.terrain
                .SphereCollisionLineTest(this.owner.position, nextLocation, this.data.radius);

            if(collisionData.tVal < 1) {
                console.log('tink');
                this.owner.sendEvent('collided', levelManager.currentLevel.terrain);
                const deltaPos = new THREE.Vector3().copy(this.owner.sharedData.nextMove);
                deltaPos.multiplyScalar(collisionData.tVal);
                this.owner.position.add(deltaPos);
                this.owner.sharedData.nextMove = new THREE.Vector3();
            }

            this.owner.position.add(this.owner.sharedData.nextMove);
            this.lastPosition.copy(this.owner.position);
        }

        // Clear list of already collided colliders
        this.collided = [];
    }
}
