import Entity from '../entity';

export interface IComponent {
    // constructor: (data: any, owner: Entity)=>void;       implicit contract, but causes typescript errors
    type?: string;
    // Called on scene load, per scene load
    initialize: ()=>void;
    // Called every frame
    update: (dt: number)=>void;
    // Called on scene unload, per scene unload
    uninitialize: ()=>void;
    // Called before an object is destroyed
    destroy: ()=>void;
}
