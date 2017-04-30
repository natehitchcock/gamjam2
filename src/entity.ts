import * as THREE from 'three';
import {PlayerController, IController} from './playercontroller';

interface ICollisionData {
    blocks: boolean;
    radius: number;
}

export default class Entity extends THREE.Object3D {
    controller: IController;
    collision: ICollisionData;
    data: any;

    moveSpeed: number;

    constructor(controller: IController, data: any) {
        super();
        this.data = data;
        this.controller = controller;
        this.moveSpeed = data.moveSpeed;
        this.collision = data.collision;

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(data.image, (texture) => {
            const material = new THREE.MeshBasicMaterial( {map: texture, transparent: true} );
            const testCube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), material);
            this.add(testCube);
            console.log(texture);
        });
    }

    update(dt) {

        if(this.controller !== undefined) {
            const desiredMove = this.controller.GetDesiredMove();
            const desiredLook = this.controller.GetDesiredLook();

            const nextPos = new THREE.Vector2().copy(desiredMove);
            nextPos.multiplyScalar(this.moveSpeed * dt);

            this.position.add(new THREE.Vector3(nextPos.x, nextPos.y, this.position.z));
        }
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