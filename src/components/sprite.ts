import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';

interface ISpriteScale {
    x: number;
    y: number;
}

interface ISpriteData {
    image: string;
    zOrder: number;
    scale: ISpriteScale;
}

export default class Sprite implements IComponent {
    data: ISpriteData;
    mesh: THREE.Mesh;

    constructor(data: ISpriteData, owner: Entity) {
        this.data = data;

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(data.image, (texture) => {
            let scaleX = 32;
            let scaleY = 32;

            if(data.scale) {
                scaleX = data.scale.x || 32;
                scaleY = data.scale.y || 32;
            }

            texture.magFilter = THREE.NearestFilter;
            const material = new THREE.MeshBasicMaterial( {map: texture, alphaTest: 0.1} );
            this.mesh = new THREE.Mesh(new THREE.CubeGeometry(scaleX, scaleY, 50), material);
            this.mesh.position.z = data.zOrder || 0;
            owner.add(this.mesh);
        });
    }

    initialize() {
        return;
    }

    destroy() {
        return;
    }

    update(dt: number) {
        return;
    }
}
