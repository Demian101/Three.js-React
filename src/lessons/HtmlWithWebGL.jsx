import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls, shaderMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useControls, Leva, folder } from 'leva';
import FlightHelmetModel from '../generatedModels/FlightHelmet';

// env imports
import px from '../textures/environmentMaps/3/px.jpg';
import nx from '../textures/environmentMaps/3/nx.jpg';
import py from '../textures/environmentMaps/3/py.jpg';
import ny from '../textures/environmentMaps/3/ny.jpg';
import pz from '../textures/environmentMaps/3/pz.jpg';
import nz from '../textures/environmentMaps/3/nz.jpg';

/**
 * Sphere Component
 */
function Sphere() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => console.log('Sphere: Hidden ::::', hidden), [hidden]);

  return (
    <mesh position={[3, 0, 0]}>
      <sphereBufferGeometry args={[1]} />
      <meshStandardMaterial color={'aquamarine'} />
      <Html
        position={[1.25, 0, 0]}
        className="HtmlContainer"
        center
        // controlling occlude transition
        occlude // can be true, or 3dObject refs
        onOcclude={setHidden}
        style={{
          transition: 'all 0.5s',
          opacity: hidden ? 0 : 1,
          transform: `scale(${hidden ? 0.5 : 1})`
        }}
      >
        <p>SPHERE</p>
      </Html>
    </mesh>
  );
}

/**
 * Box Component
 */
function Box() {
  const [show, setShow] = useState(false);
  return (
    <mesh
      position={[-3, 0, 0]}
      onPointerEnter={() => setShow(true)}
      onPointerLeave={() => setShow(false)}
    >
      <boxBufferGeometry args={[1, 1]} />
      <meshStandardMaterial color={'salmon'} />
      <Html
        position={[0, 0, 2]}
        className="HtmlContainer"
        center
        occlude // can be true, or 3dObject refs
        style={{
          transition: 'all 0.5s',
          opacity: show ? 1 : 0,
          transform: `scale(${show ? 1 : 0.5})`,
          width: '150px',
          maxHeight: '100px',
          overflow: 'scroll',
          cursor: 'wait'
        }}
      >
        <p>
          SCROLL QUICKLY Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus
          iusto incidunt ut inventore quasi voluptatum unde ipsam amet
          voluptatibus nihil possimus nisi, laborum porro pariatur?
        </p>
      </Html>
    </mesh>
  );
}

/**
 * FlightHelmet Component
 */
function FlightHelmet({ environmentMapTexture }) {
  const { scale, position, rotationY, envMapIntensity, shadows, enableHTML } =
    useControls({
      FlightHelmet: folder(
        {
          scale: [10, 10, 10],
          position: [0, -4, 0],
          rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.1 },
          envMapIntensity: { value: 3.5, min: 0, max: 10, step: 0.1 },
          shadows: true,
          enableHTML: true
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
      enableHTML={enableHTML}
    />
  );
}

/**
 * Main Component
 */
function HtmlWithWebGL() {
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

        {/* MODELS / no need for suspense here as it is provided higher in the tree */}
        <FlightHelmet environmentMapTexture={environmentMapTexture} />

        <Box />
        <Sphere />

        <Lights />
      </Canvas>
      <Leva />
    </div>
  );
}

export default HtmlWithWebGL;

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
        collapsed: true
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
      <ambientLight />
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
