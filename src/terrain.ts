import * as THREE from 'three';

export class Terrain extends THREE.Object3D {
    levelArray: number[][];

    SpawnLevel() {
        for(let x = 0; x < this.levelArray.length; ++x) {
            for(let y = 0; y < this.levelArray[x].length; ++y) {

                if(this.levelArray[x][y] === 1) {
                    const material = new THREE.MeshBasicMaterial( {color: 0xFa00a3} );
                    const testCube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), material);
                    testCube.position.copy(new THREE.Vector3(50*x, 50*y, 0));
                    this.add(testCube);
                }
            }
        }
    }
}

export class TerrainFactory {
    static LoadFromFile(filename: string): Terrain {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(filename, (texture) => {
            console.log('texture');
            console.log(texture);
        });

        return new Terrain();
    }

    static GenerateBoxLevel(width: number, height: number): Terrain {
        const level = new Terrain();
        level.levelArray = [];
        for(let x = 0; x < width; ++x) {
            level.levelArray.push([]);
            for(let y = 0; y < height; ++y) {
                if(x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                    level.levelArray[x].push(1);
                } else {
                    level.levelArray[x].push(0);
                }
            }
        }

        return level;
    }

    static GeneratePerfectMaze(width: number, height: number) {
        const level = new Terrain();

        level.levelArray = [];
        for(let x = 0; x < width; ++x) {
            level.levelArray.push([]);
            for(let y = 0; y < height; ++y) {
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
            if(point.x > 0 && point.x < width - 1
            && point.y > 0 && point.y < height - 1) {
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
}
