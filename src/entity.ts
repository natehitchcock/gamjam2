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

    private eventMap: {[key: string]: Array<{fn: (data: any)=>void, this?: any}> };

    constructor(data: any, label?: string) {
        super();
        this.data = data;
        this.eventMap = {};
        this.sharedData = {};
        this.label = label || "";

        this.components = [];
        for(const prop in data) {
            if(prop && ComponentMapping[prop]) {
                const comp = ComponentMapping[prop](data[prop], this);
                comp.type = prop;
                this.components.push(comp);
            }
        }
    }

    hasEvent(eventName: string) {
        return this.eventMap[eventName] !== undefined;
    }

    getComponent(type: string) {
        return this.components.find(comp => comp.type === type);
    }

    initialize() {
        this.components.forEach(comp => comp.initialize());
    }

    destroy() {
        this.components.forEach(comp => comp.destroy());
    }

    on(key: string, func: (data: any) => void, thisObj?: any) {
        if(this.eventMap[key] === undefined) this.eventMap[key] = [];

        this.eventMap[key].push({fn: func, this: thisObj});
    }

    sendEvent(key: string, data?: any, sendToChildren?: boolean) {
        if(this.eventMap[key]) {
            this.eventMap[key].forEach(tuple => tuple.fn.call(tuple.this, data));
        }

        if(sendToChildren) {
            this.children.forEach(child => {
                const chilEnt = (child as Entity);
                if(chilEnt.sendEvent) chilEnt.sendEvent(key, data, sendToChildren);
            });
        }
    }

    update(dt) {
        this.components.forEach((comp)=>comp.update(dt));
    }
}
