import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls, Leva, folder } from 'leva';
import DuckModel from '../generatedModels/Duck';
import FlightHelmetModel from '../generatedModels/FlightHelmet';
import FoxModel from '../generatedModels/Fox';
import BurgerModel from '../generatedModels/Burger';

// env imports
import px from '../textures/environmentMaps/3/px.jpg';
import nx from '../textures/environmentMaps/3/nx.jpg';
import py from '../textures/environmentMaps/3/py.jpg';
import ny from '../textures/environmentMaps/3/ny.jpg';
import pz from '../textures/environmentMaps/3/pz.jpg';
import nz from '../textures/environmentMaps/3/nz.jpg';

/**
 * FlightHelmet Component
 */
function FlightHelmet({ environmentMapTexture }) {
  const {
    scale,
    position,
    rotationY,
    envMapIntensity,
    shadows,
    animationIntensity
  } = useControls({
    FlightHelmet: folder(
      {
        scale: [10, 10, 10],
        position: [0, -4, 0],
        rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.1 },
        envMapIntensity: { value: 3.5, min: 0, max: 10, step: 0.1 },
        shadows: true,
        animationIntensity: { value: 1.5, min: 0.1, max: 10, step: 0.01 }
      },
      {
        // collapsed: true
      }
    )
  });
  return (
    <FlightHelmetModel
      scale={scale}
      position={position}
      rotation={[0, rotationY, 0]}
      envMap={environmentMapTexture}
      envMapIntensity={envMapIntensity}
      shadows={shadows}
      allowCustomShader={true}
      animationIntensity={animationIntensity}
    />
  );
}

/**
 * Main Component
 */
function ModifiedMaterials() {
  // const { ACESFilmicToneMapping } = useControls({
  //   Canvas: folder({
  //     ACESFilmicToneMapping: true
  //   })
  // })

  const [environmentMapTexture] = useLoader(THREE.CubeTextureLoader, [
    [px, nx, py, ny, pz, nz]
  ]);
  // makes lighting and colors much more realistic
  environmentMapTexture.encoding = THREE.sRGBEncoding;
  // Note: do not apply sRGBEncoding on textures such as normals or roughness etc...

  return (
    <div style={{ height: '100vh', backgroundColor: 'black' }}>
      <Canvas
        shadows
        gl={{ physicallyCorrectLights: true }}
        camera={{
          fov: 45,
          position: [0, 2, 12],
          near: 0.1,
          far: 2000
        }}
        onCreated={(canvas) => {
          // console.log(canvas.gl);
          // gl === renderer in vanilla THREE
          // gl.outputEncoding is THREE.sRGBEncoding by default in @react-three/fiber
          // canvas.gl.physicallyCorrectLights = true;
          canvas.scene.background = environmentMapTexture;
        }}
      >
        {/* <Environment
          // background
          // files={['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']}
          // path={'/../textures/environmentMaps/3/'}
          // scene
        /> */}
        <OrbitControls />

        {/* MODELS / no need for suspense here as it is provided higher in the tree */}
        <FlightHelmet environmentMapTexture={environmentMapTexture} />

        <Lights />
      </Canvas>
      <Leva />
    </div>
  );
}

export default ModifiedMaterials;

function Lights() {
  const {
    directionalLightColor,
    directionalLightIntensity,
    directionalLightPosition,
    directionalLightCastShadow
  } = useControls({
    directionalLight: folder(
      {
        directionalLightColor: '#ffffff',
        directionalLightIntensity: { value: 3, min: 0, max: 10, step: 0.01 },
        directionalLightPosition: [0.25, 3, -2.25],
        directionalLightCastShadow: true
      },
      {
        // collapsed: true
      }
    )
  });
  return (
    <>
      <directionalLight
        color={directionalLightColor}
        position={directionalLightPosition}
        intensity={directionalLightIntensity}
        castShadow={directionalLightCastShadow}
        shadow-mapSize={[1024, 1024]}
        // tweak normalBias to remove shadow acne on the burger
        // start testing from 0.01 and go up
        // increasing the value too much will create wrong shadows
        // usually, 0.05 is more than enough
        shadow-normalBias={0.02}
        // if surface is flat (not rounded), try using bias instead of normalBias
      />
    </>
  );
}
