import * as THREE from 'three';
import Pass from './Pass';
import ShaderPass from './ShaderPass';
import {CopyShader} from '../Shaders/CopyShader';

export default class EffectComposer {
    renderer: THREE.WebGLRenderer;
    renderTarget1: THREE.WebGLRenderTarget;
    renderTarget2: THREE.WebGLRenderTarget;
    writeBuffer: THREE.WebGLRenderTarget;
    readBuffer: THREE.WebGLRenderTarget;
    passes: Pass[];
    copyPass: Pass;

    constructor(renderer: THREE.WebGLRenderer, renderTarget?: THREE.WebGLRenderTarget) {
        this.renderer = renderer;

        if (renderTarget === undefined) {

            const parameters = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                stencilBuffer: false,
            };
            const size = renderer.getSize();
            renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, parameters);
            renderTarget.texture.name = "EffectComposer.rt1";
        }

        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();
        this.renderTarget2.texture.name = "EffectComposer.rt2";

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;

        this.passes = [];

        if (CopyShader === undefined)
            console.error("EffectComposer relies on CopyShader");

        this.copyPass = new ShaderPass(CopyShader);
    }

    swapBuffers() {
        const tmp = this.readBuffer;
        this.readBuffer = this.writeBuffer;
        this.writeBuffer = tmp;
    }

    addPass(pass) {
        this.passes.push(pass);

        const size = this.renderer.getSize();
        pass.setSize(size.width, size.height);

    }

    insertPass(pass, index) {
        this.passes.splice(index, 0, pass);
    }

    render(delta) {
        const maskActive = false;
        const il = this.passes.length;

        for (let i = 0; i < il; i++) {
            const pass = this.passes[i];

            if (pass.enabled === false) continue;

            pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);

            if (pass.needsSwap) {
                if (maskActive) {
                    const context = this.renderer.context;

                    context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);
                    this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);
                    context.stencilFunc(context.EQUAL, 1, 0xffffffff);
                }

                this.swapBuffers();
            }

            // if (MaskPass !== undefined) {
            //     if (pass instanceof MaskPass) {
            //         maskActive = true;
            //     } else if (pass instanceof ClearMaskPass) {
            //         maskActive = false;
            //     }
            // }
        }
    }

    reset(renderTarget) {

        if (renderTarget === undefined) {
            const size = this.renderer.getSize();
            renderTarget = this.renderTarget1.clone();
            renderTarget.setSize(size.width, size.height);

        }

        this.renderTarget1.dispose();
        this.renderTarget2.dispose();
        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;

    }

    setSize(width, height) {

        this.renderTarget1.setSize(width, height);
        this.renderTarget2.setSize(width, height);

        for(const pass of this.passes) {
            pass.setSize(width, height);
        }
    }
}
