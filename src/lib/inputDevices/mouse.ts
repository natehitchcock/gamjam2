/**
 * Handle input events from the mouse,
 * such as mouse button trigger/press/release
 * and mouse coordinates.
 */


export const mouse = {
    x: 0,
    y: 0,
    xp: 0,
    yp: 0,
    left: false,
    right: false,
};

const mouseLookUp = {
    0: 'left',
    1: 'right',
};

const handlerMap: {[button: string]: Array<(value: number) =>void>} = {};

export function on(button: number | string, handler: (value: number) => void) {
    const btn = mouseLookUp[button] || button;
    if(handlerMap[btn] === undefined) handlerMap[btn] = [];
    return handlerMap[btn].push(handler);
}

export function off(button: number|string, index: number) {
    const btn = mouseLookUp[button] || button;
    delete handlerMap[btn][index];
}


function tick() {
    requestAnimationFrame(tick);
    if(mouse.left) handlerMap['left'].forEach(fn => fn(1));

}
tick();

document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const w = window.innerWidth;
    const h = window.innerHeight;

    mouse.xp = mouse.x / w - .5;
    mouse.yp = mouse.y / h - .5;
});

document.addEventListener('mousedown', e => {
    mouse.left = true;
});

document.addEventListener('mouseup', e => {
    mouse.left = false;
});
