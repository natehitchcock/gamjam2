import * as THREE from 'three';
import Entity from '../entity';
import {IComponent} from './component';
import {levelManager} from '../level';

interface ICameraData {
    targetLabel: string;
    xoff: number;
    yoff: number;
    maxRadius: number;
    interpSpeed: number;
}

export default class Camera implements IComponent {
    data: ICameraData;
    owner: Entity;
    camera: THREE.Camera;

    constructor(data: ICameraData, owner: Entity) {
        this.data = data;
        this.owner = owner;

        const camWidth = 256;
        const camHeight = camWidth * (window.innerHeight/window.innerWidth);
        this.camera = new THREE.OrthographicCamera(-camWidth, camWidth, camHeight, -camHeight, -500, 1000);
        this.camera.position.z = 299;
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
