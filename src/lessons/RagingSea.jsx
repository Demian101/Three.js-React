import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls, shaderMaterial, Stats } from '@react-three/drei';
import * as THREE from 'three';
import { folder, Leva, useControls } from 'leva';

// shader imports using raw-loader package
/* eslint-disable import/no-webpack-loader-syntax */
import vertexShader from '!!raw-loader!./shaders/ragingSea/water/vertex.vs.glsl';
import fragmentShader from '!!raw-loader!./shaders/ragingSea/water/fragment.fs.glsl';

// import vertexShader from './shaders/ragingSea/water/vertex.vs.glsl';
// import fragmentShader from './shaders/ragingSea/water/fragment.fs.glsl';

// glsl import
// import glsl from 'babel-plugin-glsl/macro';

const WaterShaderMaterial = shaderMaterial(
  {
    uAlpha: 0,
    uTime: 0,
    // WAVES
    uBigWavesElevation: 0.2,
    // automatigically turned to vec2(4, 1.5)
    uBigWavesFrequency: [4, 1.5],
    uBigWavesSpeed: 0,
    uSmallWavesElevation: 0,
    uSmallWavesFrequency: 0,
    uSmallWavesSpeed: 0,
    uSmallWavesIterations: 0,
    // COLORS
    uDepthColor: new THREE.Color(0, 0, 0),
    uSurfaceColor: new THREE.Color(0, 0, 0),
    uColorOffset: 0,
    uColorMultiplier: 0
  },
  `${vertexShader}`,
  `${fragmentShader}`
);

extend({ WaterShaderMaterial });

/**
 * Plane Component
 */
function Plane() {
  const plane = useRef();
  const shaderMaterial = useRef();

  const {
    doubleSide,
    wireframe,
    transparent,
    opacity,
    planeSize,
    // color
    uDepthColor,
    uSurfaceColor,
    uColorOffset,
    uColorMultiplier,
    // waves
    uBigWavesElevation,
    uBigWavesFrequency,
    uBigWavesSpeed,
    uSmallWavesElevation,
    uSmallWavesFrequency,
    uSmallWavesSpeed,
    uSmallWavesIterations
  } = useControls({
    ShaderFrequency: folder({
      wireframe: false,
      doubleSide: true,
      transparent: true,
      opacity: { value: 0.95, min: 0, max: 1.0, step: 0.01 },
      planeSize: { value: 3, min: 1, max: 10, step: 0.1 },
      colors: folder({
        uDepthColor: '#186691',
        uSurfaceColor: '#9bd8ff',
        uColorOffset: { value: 0.2, min: 0, max: 1, step: 0.001 },
        uColorMultiplier: { value: 3.5, min: 0, max: 10, step: 0.01 }
      }),
      bigWaves: folder({
        uBigWavesElevation: { value: 0.1, min: 0, max: 1.0, step: 0.001 },
        uBigWavesSpeed: { value: 0.55, min: 0, max: 4, step: 0.01 },
        uBigWavesFrequency: {
          value: [3, 1.5],
          min: [0, 0],
          max: [10, 10],
          step: 0.01
        }
      }),
      smallWaves: folder({
        uSmallWavesElevation: { value: 0.15, min: 0, max: 0.5, step: 0.0001 },
        uSmallWavesFrequency: { value: 3, min: 0, max: 10, step: 0.001 },
        uSmallWavesSpeed: { value: 0.2, min: 0, max: 1, step: 0.001 },
        uSmallWavesIterations: { value: 4, min: 0, max: 10, step: 1 }
      })
    })
  });

  useFrame(({ clock }) => (shaderMaterial.current.uTime = clock.elapsedTime));

  return (
    <mesh ref={plane} transparent={transparent} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry
        args={[
          2 * planeSize,
          2 * planeSize,
          (512 * planeSize) / 4,
          (512 * planeSize) / 4
        ]}
      />
      <waterShaderMaterial
        ref={shaderMaterial}
        wireframe={wireframe}
        transparent={transparent}
        side={doubleSide ? THREE.DoubleSide : null}
        // uniforms 👇
        uAlpha={opacity}
        // sending uTime like this will cause an error, just provide it in uniforms, as it is already a property on the ref
        // uTime={shaderMaterial.current.uTime}

        // COLORS
        uDepthColor={uDepthColor}
        uSurfaceColor={uSurfaceColor}
        uColorOffset={uColorOffset}
        uColorMultiplier={uColorMultiplier}
        // WAVES
        uBigWavesElevation={uBigWavesElevation}
        uBigWavesFrequency={uBigWavesFrequency}
        uBigWavesSpeed={uBigWavesSpeed}
        uSmallWavesElevation={uSmallWavesElevation}
        uSmallWavesFrequency={uSmallWavesFrequency}
        uSmallWavesSpeed={uSmallWavesSpeed}
        uSmallWavesIterations={uSmallWavesIterations}
      />
    </mesh>
  );
}

/**
 * Main Component
 */
function RagingSea() {
  const { background } = useControls({
    Background: folder({
      background: '#6ea6d4'
    })
  });

  return (
    <div style={{ height: '100vh', backgroundColor: background }}>
      <Canvas
        shadows
        camera={{
          fov: 45,
          position: [3, 0.5, 1],
          near: 0.1,
          far: 2000
        }}
      >
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />

        <Plane />

        <Lights />
        <Stats />
      </Canvas>
      <Leva oneLineLabels />
    </div>
  );
}

export default RagingSea;

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
