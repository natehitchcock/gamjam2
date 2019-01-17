import * as THREE from 'three';
import Pass from './Pass';
import { RepeatWrapping } from 'three';

export default class ShaderPass extends Pass {
    enabled: boolean;
    textureID: string;
    uniforms: {[uniform: string]: THREE.IUniform};
    material: THREE.ShaderMaterial;
    camera: THREE.Camera;
    scene: THREE.Scene;
    quad: THREE.Mesh;

    constructor(shader, textureID?) {
        super();

        this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";
        this.enabled = true;

        if ( shader instanceof THREE.ShaderMaterial ) {
            this.uniforms = shader.uniforms;
            this.material = shader;

        } else if ( shader ) {
            this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );
            this.material = new THREE.ShaderMaterial( {

                defines: shader.defines || {},
                uniforms: this.uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader,

            } );
        }

        this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
        this.scene = new THREE.Scene();

        this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
        this.quad.frustumCulled = false; // Avoid getting clipped
        this.scene.add( this.quad );
    }

    render( renderer, writeBuffer?, readBuffer?, delta?, maskActive? ) {
        if(this.enabled === false) return;

        if ( this.uniforms[ this.textureID ] ) {
            this.uniforms[ this.textureID ].value = readBuffer.texture;
        }

        this.quad.material = this.material;

        if ( this.renderToScreen ) {
            renderer.render( this.scene, this.camera );
        } else {
            renderer.render( this.scene, this.camera, writeBuffer, this.clear );
        }

    }

}
