import Entity from '../entity';
import * as THREE from 'three';

const BulletPatterns: {[key: string]: (me: Entity, target: Entity, shotIndex: number, spreadDeg: number, bulletSpeed: number) => THREE.Vector2[]} = {}

BulletPatterns['StraightShot'] = (me: Entity, target: Entity, shotIndex: number, spreadDeg: number, bulletSpeed: number) => {
    const myPosition = me.position.clone();
    const targetPosition = target.position.clone();
    const dir = targetPosition.sub(myPosition).normalize();

    let angle = Math.atan2(dir.y, dir.x) * THREE.Math.RAD2DEG;
    angle += (Math.random() - 0.5) * spreadDeg;
    angle *= THREE.Math.DEG2RAD;

    const spreadedDir = new THREE.Vector2(Math.cos(angle), Math.sin(angle));

    const final = spreadedDir.multiplyScalar(bulletSpeed);

    return [ final ];
}

BulletPatterns['ThreeBurstShot'] = (
    me: Entity,
    target: Entity,
    shotIndex: number,
    spreadDeg: number,
    bulletSpeed: number) => {

    const myPosition = me.position.clone();
    const targetPosition = target.position.clone();
    const dir = targetPosition.sub(myPosition).normalize();

    const startAngle = Math.atan2(dir.y, dir.x) * THREE.Math.RAD2DEG;
    let randAngle = startAngle + (Math.random() - 0.5) * spreadDeg;
    randAngle *= THREE.Math.DEG2RAD;

    const lowAngle = (startAngle - spreadDeg) * THREE.Math.DEG2RAD;

    const highAngle = (startAngle + spreadDeg) * THREE.Math.DEG2RAD;

    const randDir = new THREE.Vector2(Math.cos(randAngle), Math.sin(randAngle));
    const lowDir = new THREE.Vector2(Math.cos(lowAngle), Math.sin(lowAngle));
    const highDir = new THREE.Vector2(Math.cos(highAngle), Math.sin(highAngle));

    return [
        randDir.multiplyScalar(bulletSpeed),
        lowDir.multiplyScalar(bulletSpeed),
        highDir.multiplyScalar(bulletSpeed),
    ];
}

BulletPatterns['FiveScatterBurstShot'] = (
    me: Entity,
    target: Entity,
    shotIndex: number,
    spreadDeg: number,
    bulletSpeed: number) => {

    const myPosition = me.position.clone();
    const targetPosition = target.position.clone();
    const dir = targetPosition.sub(myPosition).normalize();

    const startAngle = Math.atan2(dir.y, dir.x) * THREE.Math.RAD2DEG;

    const angles = [];

    for(let i = 0; i < 5; ++i) {
        const halfSpread = spreadDeg / 2;
        const spreadRawSlice = spreadDeg / 5;
        const spreadStartOffset = i * spreadRawSlice;
        const subspreadRange = spreadDeg / 3;

        const finalSpread = spreadStartOffset + (Math.random() - 0.5) * subspreadRange - halfSpread;
        angles.push(startAngle + finalSpread);
    }

    const radAngles = angles.map(angle => angle * THREE.Math.DEG2RAD);

    const dirs = radAngles.map(angle =>
        new THREE.Vector2(Math.cos(angle), Math.sin(angle))
        .multiplyScalar(bulletSpeed * ((Math.random() * 0.1) + 0.9)));

    return dirs;
}


export default BulletPatterns;
