import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';

interface ICameraData {
    width: number; // pixels of width
    zOffset: number;
    nearClip: number;
    farClip: number;
}

export default class Camera implements IComponent {
    data: ICameraData;
    owner: Entity;
    camera: THREE.Camera;

    constructor(data: ICameraData, owner: Entity) {
        this.data = data;
        this.owner = owner;

        const camWidth = data.width; // 256 for gameplay
        const camHeight = camWidth * (window.innerHeight/window.innerWidth);
        this.camera = new THREE.OrthographicCamera(
            -camWidth,
            camWidth,
            camHeight,
            -camHeight,
            data.nearClip,
            data.farClip,
        );

        this.camera.position.z = data.zOffset;
        owner.add(this.camera);
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
