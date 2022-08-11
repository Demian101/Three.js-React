import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { folder, Leva, useControls } from 'leva';

// shader imports using raw-loader package
/* eslint-disable import/no-webpack-loader-syntax */
import vertexShader from '!!raw-loader!./shaders/shaderPatterns/vertex.vs.glsl';
import fragmentShader from '!!raw-loader!./shaders/shaderPatterns/fragment.fs.glsl';

// import vertexShader from './shaders/shaderPatterns/vertex.vs.glsl';
// import fragmentShader from './shaders/shaderPatterns/fragment.fs.glsl';

// glsl import
// import glsl from 'babel-plugin-glsl/macro';

function BufferAttributes() {
  const buffer = useRef();

  const [array, bufferCount, itemSize] = useMemo(() => {
    const bufferCount = 1089;
    const itemSize = 1;
    const array = new Float32Array(bufferCount);

    for (let i = 0; i < bufferCount; i++) {
      array[i] = Math.random();
    }
    return [array, bufferCount, itemSize];
  }, []);

  return (
    <bufferAttribute
      ref={buffer}
      attachObject={['attributes', 'aRandom']}
      count={bufferCount}
      array={array}
      itemSize={itemSize}
    />
  );
}

const PlaneShaderMaterial = shaderMaterial(
  {
    uAlpha: 0,
  },
  `${vertexShader}`,
  `${fragmentShader}`
);

extend({ PlaneShaderMaterial });

/**
 * Plane Component
 */
function Plane() {
  const plane = useRef();
  const shaderMaterial = useRef();

  const {
    transparent,
    wireframe,
    opacity,
  } = useControls({
    ShaderFrequency: folder({
      wireframe: false,
      transparent: true,
      opacity: { value: 0.5, min: 0, max: 1.0, step: 0.01 }
    })
  });

  useFrame(({ clock }) => (shaderMaterial.current.uTime = clock.elapsedTime));

  return (
    <mesh ref={plane} transparent={transparent}>
      <planeBufferGeometry args={[1, 1, 32, 32]}>
        <BufferAttributes />
      </planeBufferGeometry>
      <planeShaderMaterial
        ref={shaderMaterial}
        wireframe={wireframe}
        transparent={transparent}
        side={THREE.DoubleSide}
        // uniforms 👇
        // uTime is provided by altering the ref directly inside useFrame
        uAlpha={opacity}
      />
    </mesh>
  );
}

/**
 * Main Component
 */
function ShaderPatterns() {
  const { background } = useControls({
    Background: folder({
      background: '#000000'
    })
  });

  return (
    <div style={{ height: '100vh', backgroundColor: background }}>
      <Canvas
        shadows
        camera={{
          fov: 45,
          position: [1, 0.5, 1],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls />

        <Plane />

        <Lights />
      </Canvas>
      <Leva />
    </div>
  );
}

export default ShaderPatterns;

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
