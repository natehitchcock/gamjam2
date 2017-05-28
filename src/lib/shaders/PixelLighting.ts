import * as THREE from 'three';

export const PixelLighting = {

    uniforms: {
        resolution: { value: new THREE.Vector2() },
        tDiffuse: { value: null },
        cameraPos: {value: new THREE.Vector2()},
        ambientLight: {value: new THREE.Vector3()},
        pixelSize: { value: 8 },
        lightCount: { value: 0 },
        lightRadius: { value: new Array<number>() },
        lightPos: { value: new Array<THREE.Vector3>() },
        lightCol: { value: new Array<THREE.Vector3>() },
    },

    vertexShader: [
    `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,


    ].join("\n"),

    fragmentShader: [
        `
            uniform sampler2D tDiffuse;
            uniform vec2 resolution;
            varying vec2 vUv;

            uniform vec2 cameraPos;
            uniform vec3 ambientLight;

            uniform float pixelSize;

            #define maxlc 1
            uniform int lightCount;
            uniform float lightRadius[maxlc];
            uniform vec3 lightPos[maxlc];
            uniform vec3 lightCol[maxlc];

            void main(void) {
                vec3 originalSample = texture2D(tDiffuse, vUv).rgb;

                if(lightCount > 0)
                {
                    int lightTestCount = 0;
                    vec3 lightValue;
                    float litAmt = 0.;

                    for(int i = 0; i < maxlc; ++i) {
                        if(i < lightCount) {
                            vec2 lightPosScaled = (lightPos[i].xy * resolution) + cameraPos;
                            vec2 uvScaled = (vUv * resolution) + cameraPos;

                            vec2 dv = floor(uvScaled / pixelSize) * pixelSize - lightPosScaled;

                            float distance = length(dv);

                            if(distance < lightRadius[i])
                            {
                                float intensity = 1. - (distance / lightRadius[i]);
                                litAmt += intensity;
                                lightValue += lightCol[i];
                                lightTestCount += 1;
                            }
                        }
                    }

                    if(lightTestCount > 0)
                    {
                        lightValue /= float(lightTestCount);
                        litAmt = clamp(litAmt, 0., 1.);
                    }
                    gl_FragColor = vec4(originalSample * (lightValue * litAmt + ambientLight * (1. - litAmt)), 1.0);
                }
                else
                {
                    gl_FragColor = vec4(originalSample, 1.0);
                }
            }
        `,
    ].join("\n"),
};
