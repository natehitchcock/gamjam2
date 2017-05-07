
interface ILoadTerrainParameters {
    filename: string;
}

interface IGenTerrainParameters {
    width: number;
    height: number;
}

interface IPoint {
    x: number;
    y: number;
}

interface IEntityData {
    tomlFile: string;
    position: IPoint;
}

interface ILevelData {
    terrainGenMethod: string;
    terrainGenParams: ILoadTerrainParameters | IGenTerrainParameters;
    entities: IEntityData[];
}

export default class Level {
    data: ILevelData;

    constructor(data: ILevelData) {
        this.data = data;
    }

    SpawnEntities() {
        return;
    }
}
