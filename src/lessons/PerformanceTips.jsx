import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from 'three';
import { folder, Leva, useControls } from 'leva';
import { BufferGeometryUtils } from 'three';

/**
 * TIPS:
 * 
 * FPS
 * 01 Use stats.js (Stats from Drei)
 *    <Stats /> can be added inside or outside Canvas component
 * 
 * 02 Run Chrome without FPS limit
 *    Gist Link: https://gist.github.com/brunosimon/c15e7451a802fa8e34c0678620022f7d
 * 
 *    First, close Chrome
 *    
 *    # Unix (Terminal)
 *    open -a "Google Chrome" --args --disable-gpu-vsync --disable-frame-rate-limit
 *    
 *    # Windows (Command prompt)
 *    start chrome --args --disable-gpu-vsync --disable-frame-rate-limit
 * 
 *    Sometimes, the process must be repeated twice to make it work
 *    To lock FPS again, simply close Chrome and reopen it normally
 * 
 * 03 Download Spector.js Chrome extension to monitor draw calls
 * 
 * 04 Renderer Information
 *    const { gl } = useThree()
 *    console.log(gl.info)
 * 
 * 05 Avoid expensive operations in the Tick function
 *    Tick function === useFrame
 * 
 * 06 Dispose of objects that are no longer needed
 *    In R3F, unmounting a component will dispose of its objects
 *    Easier than what's below 👇
 *    scene.remove(cube)
 *    cube.geometry.dispose()
 *    cube.material.dispose()
 * 
 * LIGHTS/SHADOWS
 * 07 Avoid lights as much as possible
 *    OR use cheap lights: ambient, hemisphere, directional
 * 
 * 08 Avoid adding or removing lights (mid-scene)
 *    That will cause all materials supporting lights to be recompiled
 * 
 * 09 Avoid shadows (use baked shadows)
 * 
 * 10 Optimize shadow maps
 *    Try using the smallest mapSize possible {[1024, 1024]}
 * 
 * 11 Use castShadow and receiveShadow wisely
 * 
 * 12 Deactivate shadow auto update (stale scene)
 *    shadows will be rendered on 1st frame only 👇
 *    gl.shadowMap.autoUpdate = false
 *    gl.shadowMap.needsUpdate = true
 *    OR/AND update shadows manually every few frames
 * 
 * TEXTURES
 * 13 Resize texture (they can take a lot of space in GPU)
 *    Not about file size, but resolution (pixels)
 * 
 * 14 Keep a power of 2 resolutions with textures (for mipmapping)
 *    Width and Height don't need to match (as in a square image) 
 * 
 * 15 Reduce image weight (TinePNG website) for faster website loading 
 *    Choose best format:
 *      JPG is smaller than PNG, but PNG is useful for alphaMaps
 * 
 * GEOMETRIES
 * 16 Use buffer geometries (better for performance)
 *    Classic geometries have attributes such as (vertices)
 *    Buffers lack these attributes, but custom attributes can be added
 * 
 * 17 Avoid Updating vertices (mid-scene, especially in useFrame)
 * 
 * 18 Mutualize geometries (one geo for multiple meshes of same type)
 * 
 * 19 Merge geometries
 *    Even with mutualized geos, each mesh will be drawn in a separate draw call
 *    Solution 👇
 *    import { BufferGeometryUtils } from 'three'
 *    // or from 'three/examples/jsm/utils/BufferGeometryUtils.js'
 *    // create geometries in for loop and push them to an array outside the loop
 *    const mergedGeo = BufferGeometryUtils.mergeBufferGeometries(geosArray)
 *    const mesh = new THREE.Mesh(mergedGeo, material)
 *    // but cannot animate/update a geo without updating all others merged
 *    // check #22 instancedMesh
 * 
 * MATERIALS
 * 20 Mutualize materials
 * 
 * 21 Use cheap materials: basic, lambert, phong
 *    Standard & physical materials need more resources
 * 
 * MESHES
 * 22 Use instancedMesh
 *    https://codesandbox.io/s/r3f-cannon-instanced-physics-g1s88
 *    https://threejs.org/docs/?q=instanced#api/en/objects/InstancedMesh
 *    args={[geometry, material, instances]}
 * 
 * MODELS
 * 23 Low poly models (if you need details, use normal maps)
 * 
 * 24 Draco compression (smaller model size, but with initial freeze on website load)
 * 
 * 25 Gzip (server side compression)
 *    Most servers don't gzip .gltf and .obj files etc...
 *    Look for a way to achieve gzip on model files
 *    gzip can cut site size to more than half (very useful)
 * 
 * CAMERA
 * 26 Camera FOV
 *    Frustum Culling (objects not in FOV won't be rendered)
 *    Hence, reducing FOV increases performance
 * 
 * 27 Near & Far (reduce for better performance)
 * 
 * RENDERER || GL
 * 28 PixelRatio (more than 2 is too much)
 *    renderer||gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 * 
 * 29 Power Preference (when instantiating the renderer)
 *    powerPreference: 'high-performance'
 *    If FPS is good, no need for this config
 * 
 * 30 Anti-Alias
 *    Should be disabled for users with pixelRatio >= 2
 *    Because it already looks good, and can hinder performance if activated
 * 
 * POSTPROCESSING
 * 31 Limit passes
 *    if resolution: 1920x1080 & passes: 4 & pixelRatio: 2
 *    then 1920 * 2 * 1080 * 2 * 4 = 33,177,600 pixels to render per frame 🤯
 *    merge passes into one if they are custom
 *    BUT 👇
 *    @react-three/postprocessing merges passes automatically 😉
 *    Use as much as pleases your heart
 * 
 * SHADERS
 * 32 Specify precision
 *    new THREE.ShaderMaterial({
 *      precision: 'lowp',
 *    })
 *    Might give the same result with better performance, but might result in glitches
 * 
 * 33 Keep shader code simple
 *    Avoid if statements (use step or clamp or max)
 *    Use swizzle
 *    (cool terrain texture in lesson30 final code (minute 58 in lesson video))
 * 
 * 34 Use textures and manipulate them instead of perlin noises
 *    This way, millions of calculations are avoided
 *    Choose a texture that represents the noise
 * 
 * 35 Use defines
 *    If a uniform's value won't change, define it as constant (better performance)
 *    no semicolons, no equal sign
 *    #define DISPLACEMENT_STRENGTH 1.5
 *    // uniform float uDisplacementStrength;
 * 
 * 36 Do calculations in the vertex shader 
 *    Because we have less vertices than fragments
 *    For the shader function will run for each vertex or fragment
 *    Then send them as varyings
 *    But won't be as detailed as doing the calcs in the fragShader
 * 
 * GENERAL
 * 37 Keep an eye on performances from the beginning
 * 
 * ** More tips n' tricks: https://discoverthreejs.com/tips-and-tricks/
 * 
 */

/**
 * Plane
 */
function Plane(props) {
  const [plane] = usePlane(() => ({
    mass: 0,
    type: 'Static',
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    args: [25, 25],
    ...props
  }));
  return (
    <mesh
      ref={plane}
      receiveShadow
      // rotation-x={-Math.PI / 2}
    >
      <planeBufferGeometry args={[25, 25]} />
      <meshStandardMaterial color={'grey'} />
    </mesh>
  );
}

/**
 * Box
 */
function Box({ color, x, y, z }) {
  const [box] = useBox(() => ({
    mass: 1,
    position: [x, y, z],
    rotation: [
      (Math.random() * Math.PI) / 2,
      (Math.random() * Math.PI) / 2,
      (Math.random() * Math.PI) / 2
    ],
    args: [0.5, 0.5, 0.5]
  }));
  return (
    <mesh
      ref={box}
      castShadow
      // position={[0, 5, 0]}
    >
      <boxBufferGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Boxes({ boxes }) {
  const rainingBoxes = useMemo(() => {
    return (
      <>
        {new Array(boxes).fill(1).map((box, i) => {
          const colors = ['lime', 'orange', 'royalblue', 'crimson'];
          const colorIndex = i % 4;
          const x = Math.random() < 0.5 ? 1 : -1;
          const z = Math.random() < 0.5 ? 1 : -1;
          return (
            <Box
              key={Math.random() * i}
              x={x}
              y={i + 3}
              z={z}
              color={colors[colorIndex]}
            />
          );
        })}
      </>
    );
  }, [boxes]);
  return rainingBoxes;
}

/**
 * Sphere
 */
function Sphere(props) {
  const [sphere] = useSphere(() => ({
    mass: 1,
    args: [1],
    position: [0, 0.75, 0]
  }));

  return (
    <mesh castShadow ref={sphere}>
      <sphereBufferGeometry args={[1]} />
      <meshStandardMaterial color={'lightgrey'} />
    </mesh>
  );
}

/**
 * Main Component
 */
function PerformanceTips() {
  // controls
  const { gravity, boxes } = useControls({
    gravity: { value: -9.82, min: -9.82, max: 0, step: 0.1 },
    boxes: { value: 50, min: 1, max: 100, step: 1 }
  });

  return (
    <div style={{ height: '100vh', backgroundColor: 'black' }}>
      <Canvas
        shadows
        camera={{
          fov: 45,
          position: [15, 10, 15],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls />

        <Physics gravity={[0, gravity, 0]}>
          <Plane />
          {/* Raining Boxes */}
          <Boxes boxes={boxes} />
          <Sphere />
        </Physics>

        <Lights />
      </Canvas>
      <Stats />
      <Leva />
    </div>
  );
}

export default PerformanceTips;

function Lights() {
  const {
    Point_Light_Intensity: pointLightIntensity,
    Point_Light_Color: pointLightColor,
    Hemisphere_Light_Intensity: hemisphereIntensity,
    Hemisphere_Sky_Light_Color: hemisphereSkyColor,
    Hemisphere_Ground_Light_Color: hemisphereGroundColor
  } = useControls({
    Lights: folder(
      {
        Point_Light: folder(
          {
            Point_Light_Intensity: { value: 1, min: 0, max: 10, step: 0.01 },
            Point_Light_Color: '#e1e1e1'
          },
          {
            collapsed: true
          }
        ),
        Hemisphere_Light: folder(
          {
            Hemisphere_Light_Intensity: {
              value: 1,
              min: 0,
              max: 10,
              step: 0.01
            },
            Hemisphere_Sky_Light_Color: '#e1e1e1',
            Hemisphere_Ground_Light_Color: '#e1e1e1'
          },
          {
            collapsed: true
          }
        )
      },
      {
        collapsed: true
      }
    )
  });
  return (
    <>
      <hemisphereLight
        args={[hemisphereSkyColor, hemisphereGroundColor, hemisphereIntensity]}
      />
      <pointLight
        castShadow
        args={[pointLightColor, pointLightIntensity, 20, 1]}
        position={[-5, 5, 5]}
      />
    </>
  );
}
