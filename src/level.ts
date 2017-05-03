import * as THREE from 'three';

export default class Level extends THREE.Object3D {
    levelArray: number[][];

    LoadLevel(filename: string) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(filename, (texture) => {
            console.log('texture');
            console.log(texture);
        });
    }

    GenerateLevel(width: number, height: number) {
        this.levelArray = [];
        for(let x = 0; x < width; ++x) {
            this.levelArray.push([]);
            for(let y = 0; y < height; ++y) {
                if(x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                    this.levelArray[x].push(1);
                } else {
                    this.levelArray[x].push(0);
                }
            }
        }
    }

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
