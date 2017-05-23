import Entity from '../entity';

export interface IComponent {
    // constructor: (data: any, owner: Entity)=>void;       implicit contract, but causes typescript errors
    type?: string;
    initialize: ()=>void;
    update: (dt: number)=>void;
    destroy: ()=>void;
}
