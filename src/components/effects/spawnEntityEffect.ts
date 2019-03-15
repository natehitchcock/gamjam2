import Entity from '../../entity';
import {Effect, IEffectData} from './effect';
import {Level, levelManager} from '../../level';

interface ISpawnEntityEffectData extends IEffectData {
    entity: string;
}

export default class SpawnEntityEffect extends Effect {
    data: ISpawnEntityEffectData;
    owner: Entity;

    constructor(data: any, owner: Entity) {
        super(data, owner);

        this.data = data;
        this.owner = owner;
    }

    activate() {
        this.SpawnEntity(this.data.entity);
        super.activate();
    }

    private SpawnEntity(tomlFile: string) {
        const entityData = require(`../../toml/${tomlFile}`);
        const ent = new Entity(entityData);
        ent.position.x = this.owner.position.x;
        ent.position.y = this.owner.position.y;
        ent.position.z = this.owner.position.z;
        console.log(`spawning ${tomlFile} at ${ent.position.x}, ${ent.position.y}`);

        let sender: Entity;
        if(this.owner.parent instanceof Entity) sender = this.owner.parent;
        else sender = this.owner;

        ent.sharedData.sender = sender;

        levelManager.currentLevel.addEntity(ent);
    }

    // // Called on scene load, per scene load
    // initialize() {

    // }

    // // Called every frame
    // update(dt: number) {
        
    // }

    // // Called on scene unload, per scene unload
    // uninitialize() {
        
    // }
    
    // // Called before an object is destroyed
    // destroy() {
        
    // }
}
