import * as THREE from 'three';
//import * as fs from 'fs';

interface ITerrainGenParams {
    width: number;
    height: number;
    tileSet: string;
}

interface ICaveParams extends ITerrainGenParams {
    chanceToFill: number;
    iterationCount: number;
    extentToScan: number;
    requiredToFill: number;
    requiredToOpen: number;
}

export const tileSize = {x: 32, y: 64};

export class Terrain extends THREE.Object3D {
    levelArray: number[][];
    tileSet: string;
    dimensions: THREE.Vector2;

    constructor(dim?: THREE.Vector2, tileSet?: string) {
        super();
        this.dimensions = dim || new THREE.Vector2(0, 0);
        this.tileSet = tileSet || 'default';
    }

    getTileType(x: number, y: number): number {
        // [WARN] does not handle being called on a tile outside the boundaries
        const left = x-1;
        const right = x+1;
        const up = y+1;
        const down = y-1;
        let result = 0;

        if(up >= this.levelArray[x].length || this.levelArray[x][up] === 1) result |= 1 << 1;
        if(right >= this.levelArray.length || this.levelArray[right][y] === 1) result |= 1 << 2;
        if(down < 0 || this.levelArray[x][down] === 1) result |= 1 << 3;
        if(left < 0 || this.levelArray[left][y] === 1) result |= 1 << 4;

        if(this.levelArray[x][y] === 1) result |= 1;

        return result;
    }

    SpawnLevel() {
        const textureLoader = new THREE.TextureLoader();
        for(let x = 0; x < this.levelArray.length; ++x) {
            for(let y = 0; y < this.levelArray[x].length; ++y) {
                if(this.tileSet) {
                    const tileType = this.getTileType(x, y);
                    const img = tileType + ".png";
                    const zorder = (tileType & 1);

                    textureLoader.load(`/img/tilesets/${this.tileSet}/${img}`, (texture) => {
                            texture.magFilter = THREE.NearestFilter;
                            const material = new THREE.MeshBasicMaterial({
                                map: texture,
                                alphaTest: 0.1,
                            });
                            const testCube = new THREE.Mesh(
                                new THREE.CubeGeometry(
                                    tileSize.x,
                                    tileSize.y,
                                    10),
                                material);

                            testCube.position.copy(
                                new THREE.Vector3(
                                    (tileSize.x*x) + (tileSize.x/2),
                                    (tileSize.x*y) + (tileSize.y/2),
                                    zorder - y));

                            this.add(testCube);
                        });
                } else { // debug square rendering
                    if(this.levelArray[x][y] === 1) {
                        const material = new THREE.MeshBasicMaterial( {color: 0xFa00a3} );
                        const testCube = new THREE.Mesh(
                            new THREE.CubeGeometry(tileSize.x,
                                                   tileSize.y,
                                                   10),
                                                   material);
                        testCube.position.copy(
                            new THREE.Vector3(
                                (tileSize.x*x) + (tileSize.x/2),
                                (tileSize.x*y) + (tileSize.x/2),
                                2));
                        this.add(testCube);
                    }
                }
            }
        }
    }

    SphereCollisionTest(center: THREE.Vector3, radius: number) {
        // Get vector in terms of terrain space
        // Assuming square terrain tiles
        const newCenter = new THREE.Vector3().copy(center);
        newCenter.multiplyScalar(1/(tileSize.x));
        radius /= tileSize.x;
        const squareExtent = 0.5;

        let collisionDetected = false;
        const collisionZoneX = [
            Math.max(Math.floor(newCenter.x) - 1, 0), // min
            Math.min(Math.floor(newCenter.x) + 1, this.levelArray.length - 1), // max
        ];

        for (let x = collisionZoneX[0]; x <= collisionZoneX[1]; ++x) {
            const collisionZoneY = [
                Math.max(Math.floor(newCenter.y) - 1, 0), // min
                Math.min(Math.floor(newCenter.y) + 1, this.levelArray[x].length - 1), // max
            ];

            for(let y = collisionZoneY[0]; y <= collisionZoneY[1]; ++y) {
                const posX = x + 0.5;
                const posY = y + 0.5;
                if(this.levelArray[x][y] === 1) {
                    // Circle to box collision
                    if(Math.abs(posX - newCenter.x) > Math.abs(posY - newCenter.y)) {
                        if (newCenter.x > posX) { // right side
                            if(newCenter.x - radius < posX + squareExtent) {
                                newCenter.x += (posX + squareExtent) - (newCenter.x - radius);
                                collisionDetected = true;
                            }
                        } else { // left side
                            if(newCenter.x + radius > posX - squareExtent) {
                                newCenter.x -= (newCenter.x + radius) - (posX - squareExtent);
                                collisionDetected = true;
                            }
                        }
                    } else {
                        if(newCenter.y > posY) { // top side
                            if(newCenter.y - radius < posY + squareExtent) {
                                newCenter.y += (posY + squareExtent) - (newCenter.y - radius);
                                collisionDetected = true;
                            }
                        } else { // bottom side
                            if(newCenter.y + radius > posY - squareExtent) {
                                newCenter.y -= (newCenter.y + radius) - (posY - squareExtent);
                                collisionDetected = true;
                            }
                        }
                    }
                }
            }
        }

        newCenter.multiplyScalar(tileSize.x);
        return {
            collisionDetected,
            newCenter,
        };
    }

    SphereCollisionLineTest(start: THREE.Vector3, end: THREE.Vector3, radius: number) {
        // [TODO] make this way more efficient by only iterating over things the line passes through
        start = new THREE.Vector3().copy(start);
        end = new THREE.Vector3().copy(end);

        // Get vector in terms of terrain space
        start.multiplyScalar(1/(tileSize.x));
        end.multiplyScalar(1/(tileSize.x));
        radius /= tileSize.x;

        let collisionHappened = false;
        let finalTVal = 1;
        let finalNormal: any = {};

        for(let x = 0; x < this.levelArray.length; ++x) {
            for(let y = 0; y < this.levelArray[x].length; ++y) {
                if(this.levelArray[x][y] === 1) {
                    let tVal = 1;
                    let wasXCollision = false;
                    let message = "";
                    const normal: any = {};

                    // left side test
                    if((start.x + radius) - x <= 0
                    && (end.x + radius) - x >= 0) {
                        message = 'left hit';
                        wasXCollision = true;
                        tVal = Math.min(tVal, ((start.x + radius) - x)/(end.x - start.x));
                        normal.x = -1;
                        normal.y = 0;
                    }
                    // right side test
                    if((start.x - radius) - (x + 1) >= 0
                    && (end.x - radius) - (x + 1) <= 0) {
                        message = 'right hit';
                        wasXCollision = true;
                        tVal = Math.min(tVal, ((start.x - radius) - (x + 1))/(end.x - start.x));
                        normal.x = 1;
                        normal.y = 0;
                    }
                    // top side test
                    if((start.y - radius) - (y + 1) >= 0
                    && (end.y - radius) - (y + 1) <= 0) {
                        message = 'top hit';
                        tVal = Math.min(tVal, ((start.y - radius) - (y + 1))/(end.y - start.y));
                        normal.x = 0;
                        normal.y = 1;
                    }
                    // bottom side test
                    if((start.y + radius) - y <= 0
                    && (end.y + radius) - y >= 0) {
                        message = 'bottom hit';
                        tVal = Math.min(tVal, ((start.y + radius) - y)/(end.y - start.y));
                        normal.x = 0;
                        normal.y = -1;
                    }

                    const collisionX = start.x + (end.x - start.x) * tVal;
                    const collisionY = start.y + (end.y - start.y) * tVal;
                    if(tVal < finalTVal) {
                        if(wasXCollision) {
                            if(collisionY <= y + 1
                            && collisionY >= y) {
                                //console.log(message);
                                finalTVal = tVal;
                                finalNormal = normal;
                                collisionHappened = true;
                            }
                        } else {
                            if(collisionX <= x + 1
                            && collisionX >= x) {
                                //console.log(message);
                                finalTVal = tVal;
                                finalNormal = normal;
                                collisionHappened = true;
                            }
                        }
                    }
                }
            }
        }

        return {tVal: finalTVal, normal: finalNormal, collisionHappened};
    }
}

interface ILoadFromFileParams {
    filename: string;
}

export class TerrainFactory {

    static LoadFromFile(params: ILoadFromFileParams): Terrain {
        const textureLoader = new THREE.TextureLoader();
        //const fileData = fs.readFileSync(params.filename);

        // parse the bmp bleeeeh

        return new Terrain();
    }

    static GenerateBoxLevel(params: any): Terrain {
        const level = new Terrain(new THREE.Vector2(params.width, params.height), params.tileSet);
        level.levelArray = [];
        for(let x = 0; x < params.width; ++x) {
            level.levelArray.push([]);
            for(let y = 0; y < params.height; ++y) {
                if(x === 0 || x === params.width - 1 || y === 0 || y === params.height - 1) {
                    level.levelArray[x].push(1);
                } else {
                    level.levelArray[x].push(0);
                }
            }
        }

        return level;
    }

    static GeneratePerfectMaze(params: any) {
        console.log(`perfect maze ${params.width}, ${params.height}`);
        const level = new Terrain(new THREE.Vector2(params.width, params.height), params.tileSet);

        level.levelArray = [];
        for(let x = 0; x < params.width; ++x) {
            level.levelArray.push([]);
            for(let y = 0; y < params.height; ++y) {
                level.levelArray[x].push(1);
            }
        }

        class Point {
            x: number;
            y: number;
            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
            }
        }

        const pointQueue: Point[] = [];

        pointQueue.push(new Point(1, 1));

        function isValid(point: Point) {
            if(point.x > 0 && point.x < params.width - 1
            && point.y > 0 && point.y < params.height - 1) {
                return true;
            }
            return false;
        }

        function isOccupied(point: Point) {
            if(level.levelArray[point.x][point.y] === 1) {
                return true;
            }
            return false;
        }

        while(pointQueue.length > 0) {
            const thisPoint = pointQueue.pop();

            if(!isValid(thisPoint) || !isOccupied(thisPoint)) {
                continue;
            }

            const up = new Point(thisPoint.x, thisPoint.y + 1);
            const down = new Point(thisPoint.x, thisPoint.y - 1);
            const left = new Point(thisPoint.x - 1, thisPoint.y);
            const right = new Point(thisPoint.x + 1, thisPoint.y);

            let neighborCount = 0;

            if(isValid(up) && !isOccupied(up)) {
                neighborCount += 1;
            }
            if(isValid(down) && !isOccupied(down)) {
                neighborCount += 1;
            }
            if(isValid(left) && !isOccupied(left)) {
                neighborCount += 1;
            }
            if(isValid(right) && !isOccupied(right)) {
                neighborCount += 1;
            }

            if(neighborCount > 1) {
                continue;
            }

            level.levelArray[thisPoint.x][thisPoint.y] = 0;

            if(Math.random() > 0.5) {
                pointQueue.push(up);
                pointQueue.push(down);
                pointQueue.push(left);
                pointQueue.push(right);
            } else {
                pointQueue.push(right);
                pointQueue.push(down);
                pointQueue.push(left);
                pointQueue.push(up);
            }
        }

        return level;
    }

    static GenerateCave(params: ICaveParams) {
        const terrain = new Terrain(new THREE.Vector2(params.width, params.height), params.tileSet);

        terrain.levelArray = [];
        for(let x = 0; x < params.width; ++x) {
            terrain.levelArray.push([]);
            for(let y = 0; y < params.height; ++y) {
                if(Math.random() < params.chanceToFill) {
                    terrain.levelArray[x].push(1);
                } else {
                    terrain.levelArray[x].push(0);
                }
            }
        }

        for(let i = 0; i < params.iterationCount; ++i) {
            const nextLevelArray = [];
            console.log(terrain.levelArray);
            for(let x = 0; x < params.width; ++x) {
                nextLevelArray.push([]);
                for(let y = 0; y < params.height; ++y) {
                    const left = Math.max(x - params.extentToScan, 0);
                    const right = Math.min(x + params.extentToScan, params.width - 1);
                    const bottom = Math.max(y - params.extentToScan, 0);
                    const top = Math.min(y + params.extentToScan, params.height - 1);
                    let filledNeighborCount = 0;
                    let totalCount = 0;
                    for(let xp = left; xp <= right; ++xp) {
                        for(let yp = bottom; yp <= top; ++yp) {
                            if(xp === x && yp === y) continue;
                            ++totalCount;
                            if(terrain.levelArray[xp][yp] === 1) ++filledNeighborCount;
                        }
                    }
                    if(filledNeighborCount >= params.requiredToFill) nextLevelArray[x].push(1);
                    else if(totalCount - filledNeighborCount > params.requiredToOpen) nextLevelArray[x].push(0);
                    else nextLevelArray[x].push(terrain.levelArray[x][y]);
                }
            }
            terrain.levelArray = nextLevelArray;
        }

        return terrain;
    }
}
