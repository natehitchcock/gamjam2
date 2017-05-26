import Pass from './Pass';

export default class RenderPass extends Pass {
    scene: THREE.Scene;
    camera: THREE.Camera;
    overrideMaterial: THREE.Material | undefined;
    clearColor: THREE.Color;
    clearAlpha: number;
    clearDepth: boolean;

    constructor(scene, camera, overrideMaterial?, clearColor?, clearAlpha?) {
        super();

        this.scene = scene;
        this.camera = camera;

        this.overrideMaterial = overrideMaterial;

        this.clearColor = clearColor;
        this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 0;

        this.clear = true;
        this.clearDepth = false;
        this.needsSwap = false;
    }

    render( renderer, writeBuffer?, readBuffer?, delta?, maskActive? ) {

        const oldAutoClear = renderer.autoClear;
        renderer.autoClear = false;

        if(this.overrideMaterial) this.scene.overrideMaterial = this.overrideMaterial;

        let oldClearColor;
        let oldClearAlpha;

        if ( this.clearColor ) {

            oldClearColor = renderer.getClearColor().getHex();
            oldClearAlpha = renderer.getClearAlpha();

            renderer.setClearColor( this.clearColor, this.clearAlpha );

        }

        if ( this.clearDepth ) {

            renderer.clearDepth();

        }

        renderer.render( this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear );

        if ( this.clearColor ) {

            renderer.setClearColor( oldClearColor, oldClearAlpha );

        }

        if(this.overrideMaterial) this.scene.overrideMaterial = null;
        renderer.autoClear = oldAutoClear;
    }
}
