import * as THREE from 'three';
import {IComponent} from './components/component';
import ComponentMapping from './components/componentMapping';
import {PlayerController, IController} from './playercontroller';

interface ICollisionData {
    blocks: boolean;
    radius: number;
}

export default class Entity extends THREE.Object3D {
    label: string;
    collision: ICollisionData;
    data: any;

    components: IComponent[];

    constructor(data: any, label?: string) {
        super();
        this.data = data;
        this.label = label || "";

        this.components = [];
        for(const prop in data) {
            if(prop) {
                console.log(prop);
                const comp = ComponentMapping[prop](data[prop], this);
                this.components.push(comp);
            }
        }
    }

    update(dt) {
        this.components.forEach((comp)=>comp.update(dt));
    }
}
