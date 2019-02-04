import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';

const allColliders: Collider[] = [];

interface IColliderData {
    blocks: boolean;
    radius: number;
    collisionMask: number;
}

/* CollisionMask:
    1: Player
    2: Enemy
    4: Bullet
    8: Item
*/

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
    }

    initialize() {
        allColliders.push(this);
        return;
    }

    uninitialize() {
        return;
        }

    destroy() {
        this.deleted = true;
        const myIdx = allColliders.indexOf(this);

        if(myIdx === -1) {
            console.log('asdasd');
        }
        allColliders.splice(myIdx, 1);
    }

    HandleCollision(other: Collider) {
        this.collided.push(other);
        this.owner.sendEvent('collided', other.owner);
    }

    IsCollidingWith(other: Collider) {
        const deltaPos = new THREE.Vector3().copy(this.owner.position);
        deltaPos.sub(other.owner.position);
        deltaPos.z = 0;

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
                return;
            }

            const collisionData = this.IsCollidingWith(other);
            if(collisionData.isColliding === true) {
                this.HandleCollision(other);
                other.HandleCollision(this);

                if(this.data.blocks && other.data.blocks) {
                    const sumRadius = this.data.radius + other.data.radius;
                    const deltaVec = new THREE.Vector3().copy(this.owner.position).sub(other.owner.position);
                    deltaVec.z = 0;

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
            let collisionData = {collisionDetected: false, newCenter: nextLocation};

            if(levelManager.currentLevel && levelManager.currentLevel.terrain) {
                collisionData = levelManager.currentLevel.terrain.SphereCollisionTest(nextLocation, this.data.radius);
            }

            if(collisionData.collisionDetected) {
                this.owner.sendEvent('collided', levelManager.currentLevel.terrain);
            }

            this.owner.position.copy(collisionData.newCenter);
            // this.owner.position.z = 64-this.owner.position.y;
            this.lastPosition.copy(this.owner.position);
        }

        // Clear list of already collided colliders
        this.collided = [];
    }
}
