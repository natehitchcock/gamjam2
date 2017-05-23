import * as THREE from 'three';
import {IComponent} from './components/component';
import ComponentMapping from './components/componentMapping';

interface ICollisionData {
    blocks: boolean;
    radius: number;
}

export default class Entity extends THREE.Object3D {
    label: string;
    collision: ICollisionData;
    data: any;
    parent: THREE.Object3D;

    components: IComponent[];
    sharedData: {[key: string]: any};

    private eventMap: {[key: string]: Array<(data: any)=>void> };

    constructor(data: any, label?: string) {
        super();
        this.data = data;
        this.eventMap = {};
        this.sharedData = {};
        this.label = label || "";

        this.components = [];
        for(const prop in data) {
            if(prop && ComponentMapping[prop]) {
                console.log(prop);
                const comp = ComponentMapping[prop](data[prop], this);
                comp.type = prop;
                this.components.push(comp);
            }
        }
    }
    destroy() {
        this.components.forEach(comp => comp.destroy());
    }

    addEventListener(key: string, func: (data: any) => void) {
        if(this.eventMap[key] === undefined) this.eventMap[key] = [];

        this.eventMap[key].push(func);
    }

    sendEvent(key: string, data?: any) {
        if(this.eventMap[key]) {
            this.eventMap[key].forEach(func => func(data));
        }
    }

    update(dt) {
        this.components.forEach((comp)=>comp.update(dt));
    }
}
