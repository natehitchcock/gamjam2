import * as THREE from 'three';

export default class Pass {
    enabled: boolean;
    needsSwap: boolean;
    clear: boolean;
    renderToScreen: boolean;

    constructor() {
        // if set to true, the pass is processed by the composer
        this.enabled = true;

        // if set to true, the pass indicates to swap read and write buffer after rendering
        this.needsSwap = true;

        // if set to true, the pass clears its buffer before rendering
        this.clear = false;

        // if set to true, the result of the pass is rendered to screen
        this.renderToScreen = false;
    }

    setSize(width, height) { return; }

    render(renderer, writeBuffer?, readBuffer?, delta?, maskActive?) {

        console.error("THREE.Pass: .render() must be implemented in derived pass.");

    }
}
