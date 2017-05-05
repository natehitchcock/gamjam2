import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';

interface ISpriteData {
    image: string;
}

export default class Sprite implements IComponent {
    data: ISpriteData;
    mesh: THREE.Mesh;

    constructor(data: ISpriteData, owner: Entity) {
        this.data = data;

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(data.image, (texture) => {
            const material = new THREE.MeshBasicMaterial( {map: texture, transparent: true} );
            this.mesh = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), material);
            owner.add(this.mesh);
        });
    }

    update(dt: number) {
        return;
    }
}
