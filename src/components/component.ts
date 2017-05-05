import Entity from '../entity';

export interface IComponent {
    // constructor: (data: any, owner: Entity)=>void;       implicit contract, but causes typescript errors
    update: (dt: number)=>void;
}
