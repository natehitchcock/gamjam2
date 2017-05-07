import * as THREE from 'three';
import Entity from './entity';
import { IController } from "./playercontroller";

interface ICollisionData {
    blocks: boolean;
    radius: number;
}

export default class Bullet extends THREE.Object3D {
    collision: ICollisionData;
    data: any;
    
    moveSpeed: number;

    constructor(undefined, data: any) {
        super();
        this.data = data;
       
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(data.image, (texture) => {
            const material = new THREE.MeshBasicMaterial( {map: texture, transparent: true} );
            const testCube = new THREE.Mesh(new THREE.CubeGeometry(25, 25, 25), material);
            this.add(testCube);
        });  
    }
//every single frame, add to its y value
      update(dt) {
            this.position.add(new THREE.Vector3(0, 10, 0));
        }
    }