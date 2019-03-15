import * as THREE from 'three';
import {IComponent} from './components/component';
import ComponentMapping from './components/componentMapping';
import * as uuid from 'uuid/v4';

interface ICollisionData {
    blocks: boolean;
    radius: number;
}

export default class Entity extends THREE.Object3D {
    label: string;
    collision: ICollisionData;
    data: any;
    parent: THREE.Object3D;
    persistent: boolean;
    bindDepthToY: boolean;
    depthOffset: number;
    team: number;

    components: IComponent[];
    sharedData: {[key: string]: any};

    private eventMap: {[key: string]: Array<{id: string, fn: (data: any)=>void, this?: any}> };

    constructor(data: any, label?: string) {
        super();
        this.data = data;
        this.eventMap = {};
        this.sharedData = {};
        this.label = label || data.label || "";
        this.persistent = data ? data.persistent || false : false;
        this.bindDepthToY = data ? data.bindDepthToY || false : false;
        this.depthOffset = data ? data.depthOffset || 0 : 0;
        this.team = data ? data.team || 0 : 0;

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

    uninitialize() {
        this.components.forEach(comp => comp.uninitialize());
    }

    destroy() {
        this.components.forEach(comp => comp.destroy());
    }

    on(key: string, func: (data: any) => void, thisObj?: any) {
        if(this.eventMap[key] === undefined) this.eventMap[key] = [];

        const fid = uuid();
        this.eventMap[key].push({id: fid, fn: func, this: thisObj});

        return fid;
    }

    // Remove a function from the event listener map via the id (returned from the 'on' function)
    off(key: string, id: string) {
        if(this.eventMap[key] === undefined) return;

        const idx = this.eventMap[key].findIndex((val) => {
            return val.id === id;
        });

        if(idx >= 0) {
            this.eventMap[key].slice(idx, 1);
        }
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

        this.internal_update(dt);
    }

    private internal_update(dt) {
        if(this.bindDepthToY) {
            this.position.z = this.depthOffset - this.position.y;
        }

        this.position.x = Math.trunc(this.position.x * 100) / 100;
        this.position.y = Math.trunc(this.position.y * 100) / 100;
    }
}
