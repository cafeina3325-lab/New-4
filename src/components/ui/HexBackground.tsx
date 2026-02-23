"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HexBackground() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const container = mountRef.current;

        // --- Configuration ---
        const TEXTURE_BG = '/images/hex_bg.png';
        const TEXTURE_HEIGHT = '/images/hex_height.png';
        const TEXTURE_CARBON = '/Carbon.png';

        // Hex Logic
        const RADIUS = 3.0;
        const GAP = 0.6;
        const HEX_WIDTH = Math.sqrt(3) * RADIUS;
        const HEX_HEIGHT = 2 * RADIUS;

        // Grid Size (Massive vertical room for parallax scrolling)
        const COLS = 40;
        const ROWS = 90;

        // --- Scene ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1C1310); // Updated to #1C1310
        scene.fog = new THREE.FogExp2(0x1C1310, 0.015);

        const frustumSize = 40;
        // Move window calls inside useEffect completely
        const initWidth = window.innerWidth;
        const initHeight = window.innerHeight;
        const aspect = initWidth / initHeight;

        const camera = new THREE.OrthographicCamera(
            -frustumSize * aspect / 2, frustumSize * aspect / 2,
            frustumSize / 2, -frustumSize / 2,
            0.1, 200
        );
        camera.position.set(0, -8, 50);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setSize(initWidth, initHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // --- Lights ---
        const ambient = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambient);

        const mainLight = new THREE.DirectionalLight(0xffd700, 4.0);
        mainLight.position.set(0, 15, 40); // Moved to top-center
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.1;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -30;
        mainLight.shadow.camera.right = 30;
        mainLight.shadow.camera.top = 30;
        mainLight.shadow.camera.bottom = -30;
        scene.add(mainLight);

        const blueRim = new THREE.SpotLight(0xffa500, 12.0); // Vivid Orange/Amber rim light
        blueRim.position.set(-15, 15, 5);
        blueRim.angle = Math.PI / 3;
        blueRim.penumbra = 1.0;
        scene.add(blueRim);

        // --- Assets ---
        const loader = new THREE.TextureLoader();
        let animationFrameId: number;

        Promise.all([
            loader.loadAsync(TEXTURE_BG),
            loader.loadAsync(TEXTURE_HEIGHT),
            loader.loadAsync(TEXTURE_CARBON)
        ]).then(([bgTex, heightTex, carbonTex]) => {
            carbonTex.wrapS = THREE.RepeatWrapping;
            carbonTex.wrapT = THREE.RepeatWrapping;

            // Geometry: Rounded Hex Shape (corners smoothed via curves)
            const hexShape = new THREE.Shape();
            const cornerRadius = 0.2 // Rounding amount
            const R = RADIUS;
            const vertices = [];
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 2;
                vertices.push({ x: R * Math.cos(angle), y: R * Math.sin(angle) });
            }
            // Draw hex with rounded corners
            for (let i = 0; i < 6; i++) {
                const curr = vertices[i];
                const next = vertices[(i + 1) % 6];
                const prev = vertices[(i + 5) % 6];
                const t = cornerRadius / R;
                const fromX = curr.x + (prev.x - curr.x) * t;
                const fromY = curr.y + (prev.y - curr.y) * t;
                const toX = curr.x + (next.x - curr.x) * t;
                const toY = curr.y + (next.y - curr.y) * t;
                if (i === 0) hexShape.moveTo(fromX, fromY);
                else hexShape.lineTo(fromX, fromY);
                hexShape.quadraticCurveTo(curr.x, curr.y, toX, toY);
            }
            hexShape.closePath();

            const geometry = new THREE.ExtrudeGeometry(hexShape, {
                depth: 1,
                bevelEnabled: true,
                bevelThickness: 0.35,
                bevelSize: 0.25,
                bevelSegments: 5,
            });
            geometry.rotateZ(Math.PI / 6 + Math.PI / 2);
            geometry.translate(0, 0, 0); // Pivot at z=0

            // Material: Custom Shader Injection for Glassmorphism
            const material = new THREE.MeshPhysicalMaterial({
                color: 0x888888,
                roughness: 0.0,
                metalness: 0.1,
                transparent: true,
                opacity: 0.9,
                transmission: 0.95,
                ior: 1.45,
                thickness: 0.5,
                clearcoat: 1.0,
                clearcoatRoughness: 0.0,
            });

            const totalWidth = COLS * (HEX_WIDTH + GAP);
            const totalHeight = ROWS * (HEX_HEIGHT * 0.75 + GAP);

            material.onBeforeCompile = (shader) => {
                shader.uniforms.uTime = { value: 0 };
                shader.uniforms.uMouse = { value: new THREE.Vector3(999, 999, 0) };
                shader.uniforms.uBgTex = { value: bgTex };
                shader.uniforms.uHeightTex = { value: heightTex };
                shader.uniforms.uCarbonTex = { value: carbonTex };
                shader.uniforms.uGridSize = { value: new THREE.Vector2(totalWidth, totalHeight) };

                // Pass reference to update loop
                material.userData.shader = shader;

                // --- Vertex Shader ---
                shader.vertexShader = `
                    uniform float uTime;
                    uniform vec3 uMouse;
                    uniform sampler2D uHeightTex;
                    uniform vec2 uGridSize;
                    
                    varying vec2 vGlobalUv;
                    varying vec2 vLocalUv;
                    varying float vElevation;
                    varying float vMouseEffect;
                ` + shader.vertexShader;

                shader.vertexShader = shader.vertexShader.replace(
                    '#include <begin_vertex>',
                    `
                    #include <begin_vertex>
                    vLocalUv = position.xy;

                    // Instance Position (from instanceMatrix)
                    vec3 iPos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
                    
                    vec2 uv = (iPos.xy / uGridSize) + 0.5;
                    vGlobalUv = uv;

                    vec4 hColor = texture2D(uHeightTex, uv);
                    float baseHeight = hColor.r; // 0..1

                    float dist = distance(iPos.xy, uMouse.xy);
                    
                    float hoverRadius = 7.0;
                    float mouseEffect = smoothstep(hoverRadius, 0.0, dist); 
                    
                    float flatHeight = 1.2;
                    float riseHeight = 2.5 + baseHeight * 3.5;
                    float finalScale = mix(flatHeight, riseHeight, mouseEffect);

                    transformed.z *= finalScale;
                    
                    vElevation = finalScale;
                    vMouseEffect = mouseEffect;
                    `
                );

                // --- Fragment Shader ---
                shader.fragmentShader = `
                    uniform sampler2D uBgTex;
                    uniform sampler2D uCarbonTex;
                    varying vec2 vGlobalUv;
                    varying vec2 vLocalUv;
                    varying float vElevation;
                    varying float vMouseEffect;
                ` + shader.fragmentShader;

                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <map_fragment>',
                    `
                    diffuseColor = vec4(0.002, 0.001, 0.0, 1.0); // Warm dark base
                    `
                );

                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <opaque_fragment>',
                    `
                    // Sample Carbon pattern using local hex coordinates
                    vec4 carbonSample = texture2D(uCarbonTex, vLocalUv * 0.15); // Adjust scale if needed
                    float carbonIntensity = dot(carbonSample.rgb, vec3(0.299, 0.587, 0.114)); // grayscale weight
                    
                    // Boost contrast gently without causing pixelation (using smoothstep)
                    float sharpCarbon = smoothstep(0.25, 0.75, carbonIntensity);
                    
                    // Base colors modified by enhanced carbon texture
                    vec3 flatExact = vec3(0.025, 0.015, 0.01) * (sharpCarbon * 2.0 + 0.1); // Dark brown-black base (Removed blue)
                    vec3 hoverColor = vec3(0.8, 0.4, 0.1) * (sharpCarbon * 1.5 + 0.4); // Deep orange/amber base
                    
                    // === Enhanced 3D gradient shading ===
                    // Top face brightness (normal ~+Z)
                    float topFace = pow(max(0.0, dot(normal, vec3(0.0, 0.0, 1.0))), 0.8);
                    
                    // Upper side: warm highlight gradient
                    float upperSide = pow(max(0.0, dot(normal, normalize(vec3(0.0, 0.8, 0.6)))), 1.5) * 0.5;
                    
                    // Lower side: deep shadow
                    float lowerSide = pow(max(0.0, dot(normal, vec3(0.0, -1.0, 0.0))), 1.2) * 0.4;
                    
                    // Rim light from directly above (top-center) for edge definition
                    float rimLight = pow(max(0.0, dot(normal, normalize(vec3(0.0, 0.9, 0.4)))), 2.0) * 0.35;
                    
                    // Fresnel-like edge highlight (brightens edges viewed at grazing angle)
                    float fresnel = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 3.0) * 0.15;
                    
                    // Combine: dark base + multi-directional gradient
                    float depthShade = 0.2 + topFace * 0.8 + upperSide - lowerSide + rimLight + fresnel;
                    depthShade = clamp(depthShade, 0.15, 1.3);
                    
                    // Apply gradient to both flat and hover colors
                    vec3 flatShaded = flatExact * depthShade;
                    vec3 hoverShaded = hoverColor * depthShade;
                    
                    // Elevation-based brightness boost for hovered
                    float elevBright = smoothstep(1.5, 5.0, vElevation);
                    hoverShaded += vec3(0.15, 0.08, 0.01) * elevBright; // Amber boost (Removed blue)
                    
                    // Blend: non-hovered = flat shaded, hovered = bright blue shaded
                    float hoverBlend = smoothstep(1.2, 2.5, vElevation);
                    vec3 baseResult = mix(flatShaded, hoverShaded, hoverBlend);
                    
                    // --- GLASS SPECULAR & FRESNEL REFLECTION ---
                    vec3 viewDir = normalize(vViewPosition); 
                    
                    // Add a fake bright glare to simulate smooth glass surface (from top-center)
                    vec3 lDir1 = normalize(vec3(0.0, 0.8, 1.0));
                    vec3 h1 = normalize(lDir1 + viewDir);
                    float spec1 = pow(max(0.0, dot(normal, h1)), 300.0) * 1.5; // Very sharp, bright highlight on glass coating
                    
                    // Subtle subsurface carbon reflection to catch the light on the texture itself
                    float carbonSpec = pow(max(0.0, dot(normal, h1)), 80.0) * sharpCarbon * 0.5;
                    spec1 += carbonSpec;
                    
                    // Add Fresnel reflection (makes edges look glassy and thick)
                    float NdotV = max(0.0, dot(normal, viewDir));
                    float fresnelGlass = pow(1.0 - NdotV, 4.0);
                    vec3 fresnelReflection = vec3(1.0, 0.5, 0.2) * fresnelGlass * 0.7; // Bright orange fresnel
                    
                    // Combine custom shading + physical lights + fake reflections
                    // We also warm up the white specular highlights (spec1) to remove any cold feel
                    vec3 finalColor = baseResult + (outgoingLight * 2.5) + vec3(spec1, spec1 * 0.85, spec1 * 0.6) + fresnelReflection;
                    
                    // Glassmorphism transparency trick: edges are more opaque than center
                    // We also make non-hovered slightly more transparent and hovered more solid
                    float alphaBase = mix(0.35, 0.85, hoverBlend); // Center alpha
                    float edgeOpacify = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0); // Edges
                    float finalAlpha = clamp(alphaBase + edgeOpacify * 0.5, 0.2, 1.0);
                    
                    gl_FragColor = vec4(finalColor, finalAlpha);
                    `
                );
            };

            // Instances
            const mesh = new THREE.InstancedMesh(geometry, material, COLS * ROWS);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const dummy = new THREE.Object3D();
            let i = 0;
            const xStep = HEX_WIDTH + GAP;
            const yStep = (HEX_HEIGHT * 0.75) + GAP;

            const xStart = -totalWidth / 2;
            // Place top of grid near +30, extending deep into negative Y for scroll
            const yStart = 30 - totalHeight;

            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    let x = xStart + c * xStep;
                    let y = yStart + r * yStep;

                    if (r % 2 !== 0) {
                        x += xStep / 2;
                    }

                    dummy.position.set(x, y, 0);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i++, dummy.matrix);
                }
            }
            scene.add(mesh);

            // --- Glow Ground Plane ---
            const glowMat = new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    uTime: { value: 0 },
                    uMouse: { value: new THREE.Vector3(999, 999, 0) },
                    uGlowRadius: { value: 15.0 },
                },
                vertexShader: `
                    varying vec2 vWorldPos;
                    void main() {
                        vec4 worldPos = modelMatrix * vec4(position, 1.0);
                        vWorldPos = worldPos.xy;
                        gl_Position = projectionMatrix * viewMatrix * worldPos;
                    }
                `,
                fragmentShader: `
                    uniform float uTime;
                    uniform vec3 uMouse;
                    uniform float uGlowRadius;
                    varying vec2 vWorldPos;

                    float hash(vec2 p) {
                        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                    }
                    
                    float noise(vec2 p) {
                        vec2 i = floor(p);
                        vec2 f = fract(p);
                        vec2 u = f * f * (3.0 - 2.0 * f);
                        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
                    }

                    void main() {
                        float dist = distance(vWorldPos, uMouse.xy);
                        float hoverGlow = pow(smoothstep(uGlowRadius, 0.0, dist), 2.0); 
                        vec3 dropShadowColor = vec3(0.831, 0.725, 0.588); 
                        
                        float timeSpeed = uTime * 0.8;
                        
                        vec2 uvNoise1 = vWorldPos * 0.15 + vec2(uTime * 0.2, timeSpeed);
                        vec2 uvNoise2 = vWorldPos * 0.3 - vec2(uTime * 0.1, timeSpeed * 1.5);
                        
                        float n1 = noise(uvNoise1);
                        float n2 = noise(uvNoise2);
                        
                        float combinedNoise = (n1 * 0.7 + n2 * 0.3);
                        
                        float waveSeparation = 0.8;
                        float distortedY = vWorldPos.y + combinedNoise * 8.0; 
                        
                        float flowPattern = (sin(distortedY * waveSeparation + uTime * 3.0) + 1.0) * 0.5; 
                        
                        float flowMask = smoothstep(0.35, 0.85, combinedNoise);
                        flowPattern *= flowMask;
                        
                        float smoothWave = smoothstep(0.1, 0.9, flowPattern);
                        
                        vec3 brightChampagne = vec3(1.2, 1.0, 0.7); // Bright Champagne Gold
                        float flowIntensity = smoothWave * 2.0; 
                        
                        vec3 finalColor = mix(brightChampagne, dropShadowColor, hoverGlow);
                        float finalAlpha = hoverGlow * 0.85 + flowIntensity;
                        
                        finalAlpha = clamp(finalAlpha, 0.0, 1.0);

                        gl_FragColor = vec4(finalColor, finalAlpha);
                    }
                `,
            });
            const glowPlane = new THREE.Mesh(
                new THREE.PlaneGeometry(totalWidth * 1.5, totalHeight * 1.5),
                glowMat
            );
            glowPlane.position.z = 0.2;
            scene.add(glowPlane);


            const rayPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            const mouseWorld = new THREE.Vector3();

            // --- Parallax Scrolling State ---
            let targetScrollY = window.scrollY;
            let currentScrollYDisplay = targetScrollY;
            const smoothedMouse = new THREE.Vector3(999, 999, 0);

            const onScroll = () => {
                targetScrollY = window.scrollY;
            };
            window.addEventListener('scroll', onScroll, { passive: true });

            const onMouseMove = (e: MouseEvent) => {
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                raycaster.ray.intersectPlane(rayPlane, mouseWorld);
            };
            window.addEventListener('mousemove', onMouseMove);

            const onResize = () => {
                const newAspect = window.innerWidth / window.innerHeight;
                camera.left = -frustumSize * newAspect / 2;
                camera.right = frustumSize * newAspect / 2;
                camera.top = frustumSize / 2;
                camera.bottom = -frustumSize / 2;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };
            window.addEventListener('resize', onResize);

            // Loop
            const clock = new THREE.Clock();

            function animate() {
                animationFrameId = requestAnimationFrame(animate);
                const time = clock.getElapsedTime();

                camera.lookAt(0, 0, 0);

                // Calculate smooth scroll translation
                currentScrollYDisplay = THREE.MathUtils.lerp(currentScrollYDisplay, targetScrollY, 0.08);
                const scrollFactor = frustumSize / window.innerHeight;
                // Reduce parallax speed significantly so the background moves much slower than foreground
                const parallaxSpeed = 0.3;
                const yShift = currentScrollYDisplay * scrollFactor * parallaxSpeed;

                // Translate the instances and glow plane upwards as user scrolls down
                mesh.position.y = yShift;
                glowPlane.position.y = yShift;

                // Smooth mouse coordinates
                smoothedMouse.lerp(mouseWorld, 0.1);

                if (material.userData.shader) {
                    material.userData.shader.uniforms.uTime.value = time;
                    // Hexagons are moved by yShift, so mouse must be converted to local space
                    const localMouse = smoothedMouse.clone();
                    localMouse.y -= yShift;
                    material.userData.shader.uniforms.uMouse.value.copy(localMouse);
                }

                glowMat.uniforms.uTime.value = time;
                // GlowPlane vertex shader handles worldPos evaluation, so global mouse is fine
                glowMat.uniforms.uMouse.value.copy(smoothedMouse);

                renderer.render(scene, camera);
            }
            animate();

            // Cleanup handler appended to original return
            (container as any)._cleanup = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('resize', onResize);
                window.removeEventListener('scroll', onScroll);
                cancelAnimationFrame(animationFrameId);

                geometry.dispose();
                material.dispose();
                glowMat.dispose();
                glowPlane.geometry.dispose();
                bgTex.dispose();
                heightTex.dispose();
                carbonTex.dispose();
                renderer.dispose();

                scene.clear();
            }
        }).catch(err => {
            console.error("Failed to load HexBackground textures or initialize Three.js:", err);
        });

        // Effect cleanup
        return () => {
            if (container && container.childNodes.length > 0) {
                if ((container as any)._cleanup) {
                    (container as any)._cleanup();
                } else {
                    // if _cleanup not attached yet (promise pending), empty container
                }
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            }
        };

    }, []);

    return (
        <div
            ref={mountRef}
            className="fixed top-0 left-0 w-full h-full pb-0 mb-0 -z-10 bg-[#1C1310] overflow-hidden"
            style={{ pointerEvents: 'none' }}
        />
    );
}
