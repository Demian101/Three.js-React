import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls, shaderMaterial, useProgress } from '@react-three/drei';
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
import gsap from 'gsap/gsap-core';

const OverlayMaterial = shaderMaterial(
  {
    uAlpha: 1.0,
  },
  `
    void main() {
      // ignoring projectionMatrix & modelViewMatrix will make the plane face the camera
      gl_Position = vec4(position, 1.0);
    }
  `,
  `
    uniform float uAlpha;
    void main() {
      gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
    }
  `
)
extend({ OverlayMaterial })

/**
 * Overlay Component
 */
function Overlay() {
  const overlay = useRef()
  const { active, progress, errors, item, loaded, total } = useProgress()

  useEffect(() => {
    if (progress === 100) {
      gsap.to(overlay.current.material.uniforms.uAlpha, {
        duration: 3,
        value: 0,
        ease: 'power3.inOut'
      })
      // console.log(overlay.current);
    }
  }, [progress])
  return (
    <mesh ref={overlay}>
      <planeBufferGeometry args={[2, 2, 1, 1]} />
      <overlayMaterial
      // wireframe
      transparent 
      // uniforms
      uAlpha={1.0}
      />
    </mesh>
  )
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
 * Main Component
 */
function CanvasLoader() {
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
        <Overlay />

        {/* MODELS / no need for suspense here as it is provided higher in the tree */}
        <FlightHelmet environmentMapTexture={environmentMapTexture} />

        <Lights />
      </Canvas>
      <Leva oneLineLabels />
    </div>
  );
}

export default CanvasLoader;

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
