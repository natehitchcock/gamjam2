import * as THREE from "three";
import { IComponent } from "./component";
import Entity from "../entity";

interface IHudData {
    hudSprite: string;
}
export default class Hud implements IComponent {
    cameraHUD: Entity;
    sceneHUD: Entity;
    data: any;
    owner: Entity;
        constructor(data: IHudData, owner: Entity) {
            

var hudCanvas = document.createElement('canvas');

hudCanvas.width = innerWidth;
hudCanvas.height = innerHeight;

var hudBitmap = hudCanvas.getContext('2d');
hudBitmap.font = "Normal 40px Arial";
hudBitmap.textAlign = 'center';
hudBitmap.fillStyle = "rgba(245, 245, 245, 0.75)";
hudBitmap.fillText('Initiliazing...', innerWidth / 2, innerHeight / 2);

var cameraHUD = new THREE.OrthographicCamera(-innerWidth / 2, innerWidth / 2, innerHeight / 2, -innerHeight / 2, 0, 30 )

var sceneHUD = new THREE.Scene();

var hudTexture = new THREE.Texture(hudCanvas)
hudTexture.needsUpdate = true;

var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
material.transparent = true;

var planeGeometry = new THREE.PlaneGeometry( innerWidth, innerHeight);
var plane = new THREE.Mesh( planeGeometry, material );
sceneHUD.add( plane );
        }
   update(dt: number) {
        return;
   }
}




