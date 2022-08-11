import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
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
 * gl.physicallyCorrectLights = true ⬇️
 * This helps in getting consistent results between softwares (imported models in case they had light in their object)
 */

/**
 * Vanilla THREE imported models material update (to apply envMap)
 *
 * @param {object} scene // Object inside the imported model
 * @param {object} envMap // The loaded envMap using CubeTextureLoader
 */
const updateAllMaterials = (scene, envMap) => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMap = envMap;
      child.material.envMapIntensity = 5;
    }
  });
};

/**
 * Duck Component
 */
function Duck() {
  const { Duck_Scale: scale, Duck_Position: position } = useControls({
    Duck: folder(
      {
        Duck_Scale: [1, 1, 1],
        Duck_Position: [0, 0, 3]
      },
      {
        collapsed: true
      }
    )
  });
  return <DuckModel scale={scale} position={position} />;
}

/**
 * FlightHelmet Component
 */
function FlightHelmet({ environmentMapTexture }) {
  const { scale, position, rotationY, envMapIntensity, shadows } = useControls({
    FlightHelmet: folder(
      {
        scale: [10, 10, 10],
        position: [0, -4, 0],
        rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.1 },
        envMapIntensity: { value: 3.5, min: 0, max: 10, step: 0.1 },
        shadows: true
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
    />
  );
}

/**
 * Fox Component
 */
function Fox() {
  const { Fox_Scale: scale, Fox_Position: position } = useControls({
    Fox: folder(
      {
        Fox_Scale: [1, 1, 1],
        Fox_Position: [0, 0, -3]
      },
      {
        collapsed: true
      }
    )
  });
  return <FoxModel scale={scale} position={position} />;
}

/**
 * Burger Component from Blender
 */
function Burger({ environmentMapTexture }) {
  const { scale, rotation, position, envMapIntensity, shadows } = useControls({
    Burger: folder(
      {
        scale: [1, 1, 1],
        position: [0, -4, 5],
        rotation: [0, 0, 0],
        envMapIntensity: { value: 3.5, min: 0, max: 10, step: 0.1 },
        shadows: true
      },
      {
        collapsed: true
      }
    )
  });
  return (
    <BurgerModel
      scale={scale}
      position={position}
      rotation={rotation}
      envMap={environmentMapTexture}
      envMapIntensity={envMapIntensity}
      shadows={shadows}
    />
  );
}

/**
 * Main Component
 */
function RealisticRendering() {
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
        camera={{
          fov: 45,
          position: [10, 2, 10],
          near: 0.1,
          far: 2000
        }}
        onCreated={(canvas) => {
          // console.log(canvas.gl);
          // gl === renderer in vanilla THREE
          // gl.outputEncoding is THREE.sRGBEncoding by default in @react-three/fiber
          canvas.gl.physicallyCorrectLights = true;
          canvas.scene.background = environmentMapTexture;
        }}
        // if flat === true, renderer will use THREE.NoToneMapping instead of THREE.ACESFilmicToneMapping
        // flat={true} // false by default
      >
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />

        {/* OBJECTS */}
        {/* <Plane /> */}

        {/* MODELS / no need for suspense here as it is provided higher in the tree */}
        {/* <Duck /> */}
        <FlightHelmet environmentMapTexture={environmentMapTexture} />
        {/* <Fox /> */}
        <Burger environmentMapTexture={environmentMapTexture} />

        <Lights />
      </Canvas>
      <Leva oneLineLabels />
    </div>
  );
}

export default RealisticRendering;

/**
 * Plane
 */
function Plane(props) {
  return (
    <mesh
      // ref={plane}
      receiveShadow
      rotation-x={-Math.PI / 2}
    >
      <planeBufferGeometry args={[25, 25]} />
      <meshStandardMaterial color={'grey'} />
    </mesh>
  );
}

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

// function Lights() {
//   const {
//     Point_Light_Intensity: pointLightIntensity,
//     Point_Light_Color: pointLightColor,
//     Hemisphere_Light_Intensity: hemisphereIntensity,
//     Hemisphere_Sky_Light_Color: hemisphereSkyColor,
//     Hemisphere_Ground_Light_Color: hemisphereGroundColor
//   } = useControls({
//     Lights: folder({
//       Point_Light: folder({
//         Point_Light_Intensity: { value: 1, min: 0, max: 10, step: 0.01 },
//         Point_Light_Color: '#e1e1e1',
//       }, {
//         collapsed: true
//       }),
//       Hemisphere_Light: folder({
//         Hemisphere_Light_Intensity: { value: 1, min: 0, max: 10, step: 0.01 },
//         Hemisphere_Sky_Light_Color: '#e1e1e1',
//         Hemisphere_Ground_Light_Color: '#e1e1e1'
//       }, {
//         collapsed: true
//       })
//     }, {
//       collapsed: true
//     })
//   });
//   return (
//     <>
//       <hemisphereLight
//         args={[hemisphereSkyColor, hemisphereGroundColor, hemisphereIntensity]}
//       />
//       <pointLight
//         castShadow
//         args={[pointLightColor, pointLightIntensity, 20, 1]}
//         position={[-5, 5, 5]}
//       />
//     </>
//   );
// }
