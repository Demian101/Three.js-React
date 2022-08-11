import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { folder, Leva, useControls } from 'leva';

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

function Boxes({boxes}) {
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
function Template() {
  // controls
  const { gravity, boxes } = useControls({
    gravity: { value: -9.82, min: -9.82, max: 0, step: 0.1 },
    boxes: { value: 50, min: 1, max: 100, step: 1 },
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
      <Leva />
    </div>
  );
}

export default Template;

function Lights() {
  const {
    Point_Light_Intensity: pointLightIntensity,
    Point_Light_Color: pointLightColor,
    Hemisphere_Light_Intensity: hemisphereIntensity,
    Hemisphere_Sky_Light_Color: hemisphereSkyColor,
    Hemisphere_Ground_Light_Color: hemisphereGroundColor
  } = useControls({
    Lights: folder({
      Point_Light: folder({
        Point_Light_Intensity: { value: 1, min: 0, max: 10, step: 0.01 },
        Point_Light_Color: '#e1e1e1',
      }, {
        collapsed: true
      }),
      Hemisphere_Light: folder({
        Hemisphere_Light_Intensity: { value: 1, min: 0, max: 10, step: 0.01 },
        Hemisphere_Sky_Light_Color: '#e1e1e1',
        Hemisphere_Ground_Light_Color: '#e1e1e1'
      }, {
        collapsed: true
      })
    }, {
      collapsed: true
    })
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
