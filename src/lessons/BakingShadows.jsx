import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, useHelper, Loader } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { softShadows } from '@react-three/drei';
import { RectAreaLightHelper } from 'three-stdlib';

/**
 * MATCAPS
 */
import matcap1 from '../textures/matcaps/1.png';
import matcap3 from '../textures/matcaps/3.png';
import matcap7 from '../textures/matcaps/7.png';
import matcap8 from '../textures/matcaps/8.png';
import gradient3 from '../textures/gradients/3.jpg';
import gradient5 from '../textures/gradients/5.jpg';

/**
 * BAKED SHADOW
 */
import bakedShadow from '../textures/shadows/bakedShadow.jpg';
import simpleShadow from '../textures/shadows/simpleShadow.jpg';

// font import
import typefaceFont from '../fonts/helvetiker_regular.typeface.json';

const font = new THREE.FontLoader().parse(typefaceFont);
const textString = `marrajaho tamreejan`;
const textString2 = `!matcaps are dope!`;
const textOptions = {
  font,
  size: 1,
  height: 0.25,
  curveSegments: 8
};

// // injecting soft shadows shader
// softShadows() // kind of not working, also nullifies directionalLight

/**
 * Camera component
 */
function Motion({ textMesh, textMesh2, sphere, sphereShadow }) {
  // if not inside a useEffect, will give ref undefined error
  useEffect(() => {
    // easy centering solution instead of computing bounding box and manually translating to -50%'s
    textMesh.current.geometry.center();
    textMesh2.current.geometry.center();
  }, [textMesh, textMesh2]);

  useFrame(({clock: {elapsedTime}}) => {
    sphere.current.position.x = Math.cos(elapsedTime)
    sphereShadow.current.position.x = Math.cos(elapsedTime)
    sphere.current.position.z = Math.sin(elapsedTime)
    sphereShadow.current.position.z = Math.sin(elapsedTime)
    // Math.abs forces a positive value, making sin always positive giving a bounce effect
    sphere.current.position.y = Math.abs(Math.sin(elapsedTime * 3)) + 0.5
    // sphereShadow.current.position.y = Math.abs(Math.sin(elapsedTime * 3)) + 0.5
    sphereShadow.current.material.opacity = (1 - sphere.current.position.y) * 0.5 
    // or (1 - Math.abs(sphere.current.position.y)) * 2
    // or = (1 - sphere.current.position.y) * 0.3
  })

  return null;
}

/**
 * Lights component
 *
 * minimal cost lights  => ambient, hemisphere (because they simulate light, no castShadows)
 *
 * moderate cost lights => directional, point
 *
 * high cost lights     => spot, rectArea
 *
 * lights supporting shadows => point, directional, spot
 */
function Lighting() {
  const spotLight = useMemo(
    () => new THREE.SpotLight(0x78ff00, 0.75, 20, Math.PI * 0.1, 0.25, 1),
    []
  );

  const spotLightRotation = useRef();

  // light helpers
  const spotLightHelper = useRef();
  const pointLightHelper = useRef();
  const directionalLightHelper = useRef();
  const directionalLightShadowCameraHelper = useRef();
  const rectAreaLightHelper = useRef();

  // works without adding .current
  useHelper(spotLightHelper, THREE.SpotLightHelper, 'black'); // SpotLightHelper takes a color second arg
  useHelper(pointLightHelper, THREE.PointLightHelper, 1); // PointLightHelper takes a size second arg
  useHelper(directionalLightHelper, THREE.DirectionalLightHelper, 1);
  useHelper(directionalLightShadowCameraHelper, THREE.CameraHelper, 1);
  // RectAreaLightHelper must be imported separately (from somewhere inside three) for some reason
  // useHelper(rectAreaLightHelper, RectAreaLightHelper); // do not use it, it crashes the app

  useEffect(() => {
    // it also works without this condition
    // spotLightRotation.current &&
    gsap.to(spotLightRotation.current.position, {
      duration: 2,
      x: -3,
      repeat: -1,
      yoyo: true,
      ease: 'elastic.inOut(1.5, 1)'
      // ease: 'back.out',
    });
    // and it also works without adding the dependency
  }, [spotLightRotation]);

  useEffect(() => {
    directionalLightShadowCameraHelper.current =
      directionalLightHelper.current.shadow.camera;
  }, [directionalLightHelper]);
  return (
    <>
      {/* AMBIENT => applies light on every direction, hence, not shadow-related. It simulates light bouncing */}
      {/* <ambientLight args={[0xffffff, 0.5]} /> */}

      {/* DIRECTIONAL => faces the center of the scene (light starts from infinity to center) */}
      <directionalLight
        ref={directionalLightHelper}
        position={[2, 3, 4]}
        args={[0xffffff, 0.2]}
        // shadow props
        castShadow
        shadow-mapSize={[1024, 1024]} // improves shadow map quality, defaults are 512x512, only increase by a power of 2
        // reducing the amplitude to fit the scene increases shadow resolution
        shadow-camera-top={4}
        shadow-camera-right={7.5}
        shadow-camera-bottom={-2}
        shadow-camera-left={-7.5}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-radius={20} // radius may not work with softShadows() enabled
      />

      {/* HEMISPHERE => like ambient, but with a color from the sky different from the one from the ground */}
      {/* if the scene has sky and grass, top blue and bottom green colors can give a nice effect */}
      <hemisphereLight args={['orangered', 'orangered', 1]} />

      {/* POINTLIGHT => illuminates in every direction starting from its position */}
      <pointLight
        shadow-mapSize={[1024, 1024]} // improves shadow map quality, defaults are 512x512, only increase by a power of 2
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
        ref={pointLightHelper}
        castShadow
        position={[-2, 3, 4]}
        args={[
          //color
          0xff9000,
          // intensity
          0.9,
          // distance
          20,
          // decay => how fast the light dims
          1
        ]}
      />

      {/* RECTAREALIGHT => mix between directional and diffuse light */}
      {/* light color is mixed with objects, if plane is orange and light is cyan, result would be yellowish */}
      {/* can have nice neon effect if rest of scene is dark */}
      {/* only works with standard and physical materials */}
      {/* <rectAreaLight
        lookAt={new THREE.Vector3()}
        ref={rectAreaLightHelper}
        rotation-x={-Math.PI / 2}
        position={[0, 2.5, 2]}
        args={[0x4effee, 2, 5, 5]}
      /> */}

      {/* SPOTLIGHT => like a flashlight */}
      {/* <spotLight
        castShadow
        position={[0, 5, 5]}
        lookAt={new THREE.Vector3()}
        args={[
          0x78ff00, // color
          0.5, // intensity
          20, // distance (the bigger the longer it takes to fadee)
          Math.PI * 0.1, // angle ()
          0.25, // penumbra => the blurriness at the edges of the light
          1 // decay
        ]}
      /> */}

      {/* to rotate SPOTLIGHT, we need to add its target property to the scene */}
      <>
        <primitive
          ref={spotLightHelper}
          object={spotLight}
          castShadow
          position={[0, 5, 5]}
        />
        <primitive
          ref={spotLightRotation}
          object={spotLight.target}
          position={[3, 0, 0]}
        />
      </>
    </>
  );
}

/**
 * Main Component
 */
function BakingShadows() {
  const textMesh = useRef();
  const textMesh2 = useRef();
  const sphere = useRef();
  const sphereShadow = useRef();

  const [bakedShadowTexture, simpleShadowTexture] = useLoader(
    THREE.TextureLoader,
    [bakedShadow, simpleShadow]
  );

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}>
      <Canvas
        // shadows
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
        camera={{
          fov: 45,
          position: [3, 3, 3],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls dampingFactor={0.05} />
        <Motion
          textMesh={textMesh}
          textMesh2={textMesh2}
          sphere={sphere}
          sphereShadow={sphereShadow}
        />
        <Lighting />

        {/* TEXT MESHES */}
        <mesh castShadow ref={textMesh} position={[0, 1, -2]}>
          <textBufferGeometry args={[textString, textOptions]} />
          <meshStandardMaterial color={'crimson'} />
        </mesh>

        <mesh castShadow ref={textMesh2} position={[0, 1, 2]}>
          <textBufferGeometry args={[textString2, textOptions]} />
          <meshStandardMaterial color={'limegreen'} />
        </mesh>

        {/* SPHERE => to be given a baked shadow */}
        <mesh ref={sphere} position={[0, 0.5, 0]}>
          <sphereBufferGeometry args={[0.5]} />
          <meshStandardMaterial color={'limegreen'} />
        </mesh>

        {/* PLANE */}
        <mesh receiveShadow rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[25, 25]} />
          <meshStandardMaterial color={'orange'} />
        </mesh>

        {/* DYNAMIC SHADOW BAKING */}
        {/* the trick is to create a plane under the sphere that will follow it */}
        <mesh
          ref={sphereShadow}
          rotation-x={-Math.PI / 2}
          // if not positioned a bit above ground, it will cause z-fighting
          position-y={0 /* plane position */ + 0.01}
        >
          <planeBufferGeometry args={[1, 1]} />
          <meshBasicMaterial
            transparent
            alphaMap={simpleShadowTexture}
            color={0x000000}
          />
        </mesh>

        {/* for static baking shadows, we can do it with meshBasicMaterial too */}
        {/* but it's not dynamic, if sphere is moved from center of scene, shadow won't follow */}
        {/* <mesh receiveShadow rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[25, 25]} />
          <meshBasicMaterial map={bakedShadowTexture} color={'orange'} />
        </mesh> */}
      </Canvas>
    </div>
  );
}

export default BakingShadows;
