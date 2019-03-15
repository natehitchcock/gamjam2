import * as THREE from 'three';

export const PixelLighting = {

    uniforms: {
        resolution: { value: new THREE.Vector2() },
        tDiffuse: { value: null },
        cameraPos: {value: new THREE.Vector2()},
        ambientLight: {value: new THREE.Vector3()},
        pixelSize: { value: 2 },
        lightCount: { value: 0 },
        time: { value: 0 },
        lightRadius: { value: new Array<number>() },
        lightPos: { value: new Array<THREE.Vector3>() },
        lightCol: { value: new Array<THREE.Vector3>() },
        lightStyle: { value: new Array<number>() },
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

            uniform float time;

            #define maxlc 100
            uniform int lightCount;
            uniform float lightRadius[maxlc];
            uniform int lightStyle[maxlc];
            uniform vec3 lightPos[maxlc];
            uniform vec3 lightCol[maxlc];

            #define waveLevels 6

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

                            float radius = lightRadius[i];

                            // Style 1 is twinkly lights
                            if(lightStyle[i] == 1) {
                                vec2 dir = dv;
                                dir = normalize(dir);
                                float angle = atan(dir.y, dir.x);

                                dir.x = 0.0;
                                dir.y = 0.0;
                                for(int j = 0; j < waveLevels; ++j) {
                                    // Wave one
                                    float d = 1.0;
                                    if(mod(float(j), 2.0) == 1.0) {
                                        d = -1.0;
                                    }
                                    float pi = 3.14159;
                                    float freq = (float(j) + 1.0) * 2.0;
                                    float speed = (1.0 + 3.3451 * float(j)) * d;
                                    speed *= 0.3;
                                    float offset = 1.0 + 0.45 * float(j) * float(i + 1);
                                    dir.x += cos(angle * freq + time * speed + offset) / float(waveLevels);
                                    dir.y += sin(angle * freq + time * speed - 0.45 + offset) / float(waveLevels);
                                }

                                // Last step is to add length back to dir
                                // And make sure that it is only oscillating in the [0.75, 1] range
                                dir.x += 2.0;
                                dir.y += 2.0;

                                dir.x *= radius/3.0;
                                dir.y *= radius/3.0;

                                radius = length(dir);
                            }

                            if(lightStyle[i] == 2) {
                                float minRadius = 0.9;
                                float maxRadius = 1.2;

                                float deltaRadius = maxRadius - minRadius;
                                float tempRadius = ((sin(time) + 1.0) / 2.0) * deltaRadius;
                                tempRadius += minRadius;
                                radius *= tempRadius;
                            }

                            float distance = length(dv);

                            float remappedDist = distance / radius;

                            float intensity = 1. / (remappedDist * remappedDist);
                            intensity -= 0.1;

                            if(intensity > 0.001)
                            {
                                intensity = clamp(intensity, 0., 1.);
                                litAmt += intensity;
                                lightValue += lightCol[i] * intensity;
                                lightTestCount += 1;
                            }
                        }
                    }
                    
                    lightValue += ambientLight;
                    lightValue = clamp(lightValue, 0., 1.);

                    gl_FragColor = vec4(originalSample * lightValue, 1.0);
                }
                else
                {
                    gl_FragColor = vec4(originalSample, 1.0);
                }
            }
        `,
    ].join("\n"),
};
