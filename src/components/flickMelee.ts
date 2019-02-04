import { IComponent } from "./component";
import Entity from "../entity";
import { mouse, keyboard } from "../lib/input";
import * as THREE from "three";
import { levelManager, Level } from "../level";

export interface IFlickMeleeData {
  damage: number;
  cooldown: number;
  flickTriggerDelta: number;
  deltaAccumulationTime: number;
}

interface ILookAccumulationSample {
    timestamp: number;
    lookDelta: THREE.Vector2;
}

export default class FlickMelee implements IComponent {
    data: IFlickMeleeData;
    owner: Entity;
    lookAccumulationBuffer: ILookAccumulationSample[];
    time: number;

    constructor(data: IFlickMeleeData, owner: Entity) {
        this.data = data;
        this.owner = owner;
        this.lookAccumulationBuffer = [];

        this.time = 0;
    }

    initialize() {
        console.log('initializing flick melee');
        return;
    }

    uninitialize() {
        return;
      }

    destroy() {
        return;
    }

    update(dt) {
        this.time += dt;

        let lookDelta = new THREE.Vector2();

        const parent: Entity = this.owner.parent as Entity;
        const look: THREE.Vector2 = parent.sharedData.rawLook;
        const lastLook: THREE.Vector2 = parent.sharedData.rawLastLook;

        if(look === undefined ) return;

        if(lastLook !== undefined) {
            lookDelta = look.clone().sub(lastLook);
        } else {
            lookDelta = look.clone();
        }

        this.lookAccumulationBuffer.push({
            timestamp: this.time,
            lookDelta,
        });

        const firstNonExpired = this.lookAccumulationBuffer.findIndex((val: ILookAccumulationSample) => {
            return val.timestamp >= this.time - this.data.deltaAccumulationTime;
        });

        // Remove expired samples
        if(firstNonExpired > 0) {
            this.lookAccumulationBuffer.splice(0, firstNonExpired);
        }

        // Calculate if a flick happened
        const sum = this.SumAccumulationBuffer();

        if(sum.lookDelta.length() >= this.data.flickTriggerDelta
        && look.length() > 0.9) {
            if(look.length() > 20) {
                console.log('oops');
            }
            console.log(sum.lookDelta.length(), 'with LAB size', this.lookAccumulationBuffer.length);
            this.owner.sendEvent('melee', parent.sharedData.look.clone());
            this.lookAccumulationBuffer = [];
        }
    }

    private SumAccumulationBuffer = () => {
        return this.lookAccumulationBuffer.reduce((prev, curr, idx, arr) => {
            return {
                timestamp: 0,
                lookDelta: prev.lookDelta.add(
                    new THREE.Vector2(
                        Math.abs(curr.lookDelta.x),
                        Math.abs(curr.lookDelta.y))),
            };
        });
    }
}
