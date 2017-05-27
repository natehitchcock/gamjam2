import * as inputDevices from './inputDevices';
import {IGamepadSettings} from './inputDevices/gamepad';

const inputActions: {[action: string]: Array<{obj: any, handler: (value: number)=>void}>} = {};
const fireActions = (action: string, value: number) => {
    if(inputActions[action]) {
        inputActions[action].forEach(pair => pair.handler.call(pair.obj, value));
    }
};

interface IInputMapping {
    mouse?: string|number;
    gamepad?: string;
    key?: string|number;
    amount: number;
}

interface IInputActionMap {
    gamepadSettings: IGamepadSettings;
    actions: {[action: string]: IInputMapping[]};
}

function setupInputMappings(inputActionMap: IInputActionMap) {
    console.log('mapping ' + JSON.stringify(inputActionMap));

    inputDevices.gamepad.setGamepadSettings(inputActionMap.gamepadSettings);
    for(const action in inputActionMap.actions) {
        if(inputActionMap.actions[action]) {
            for(const mapping of inputActionMap.actions[action]) {
                if(mapping.mouse) {
                    inputDevices.mouse.on(mapping.mouse, value =>fireActions(action, mapping.amount * value));
                } else if(mapping.gamepad) {
                    const gp = inputDevices.gamepad;
                    gp.addTemplateHandler(mapping.gamepad, value => {fireActions(action, mapping.amount * value);});
                } else if(mapping.key) {
                    console.log(`mapping ${mapping.key} with value ${mapping.amount}`);
                    inputDevices.keyboard.onKeyEvent(mapping.key, inputDevices.keyboard.KS_PRESSED, () => {
                        fireActions(action, mapping.amount);
                    });
                }
            }
        }
    }
}

const inputmapping = require('../toml/systems/input.toml');
setupInputMappings(inputmapping);

export function on(actionName: string, handler: (value: number)=>void, obj?: any) {
    if(inputActions[actionName] === undefined) inputActions[actionName] = [];
    return inputActions[actionName].push({obj, handler});
}

export function off(actionName: string, handlerId: number) {
    delete inputActions[actionName][handlerId];
}

export const mouse = inputDevices.mouse;
export const keyboard = inputDevices.keyboard;
export const gamepad = inputDevices.gamepad;
