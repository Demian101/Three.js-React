import React, { useEffect, useMemo, useRef, Suspense } from 'react';
import {
  Canvas,
  useThree,
  useFrame,
  extend,
  useLoader
} from '@react-three/fiber';
import { OrbitControls, TrackballControls, Loader } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
/**
 * useful links
 * https://3dtextures.me/
 * https://poligon.com/
 * https://www.arroway-textures.ch/
 * https://3dtextures.me/2019/04/16/door-wood-001/
 * https://marmoset.co/posts/physically-based-rendering-and-you-can-too/
 * https://marmoset.co/posts/basic-theory-of-physically-based-rendering/
 */

/**
 * texture imports
 */
import doorColor from '../textures/door/basecolor.jpg';
import doorAmbientOcclusion from '../textures/door/ambientOcclusion.jpg';
import doorHeight from '../textures/door/height.png';
import doorMetallic from '../textures/door/metallic.jpg';
import doorNormal from '../textures/door/normal.jpg';
import doorOpacity from '../textures/door/opacity.jpg'; // opacity is also called alpha
import doorRoughness from '../textures/door/roughness.jpg';

/**
 * Camera component
 */

function Camera({box}) {
  useFrame(({camera, delta}) => {
    camera.lookAt(box.current.position)
  })
  return null
}

/**
 * Main Component
 */
function Textures() {
  const box = useRef();

  /**
   * loading textures
   */
  const [
    doorColorTexture,
    doorAmbientOcclusionTexture,
    doorHeightTexture,
    doorMetallicTexture,
    doorNormalTexture,
    doorOpacityTexture,
    doorRoughnessTexture
  ] = useLoader(THREE.TextureLoader, [
    doorColor,
    doorAmbientOcclusion,
    doorHeight,
    doorMetallic,
    doorNormal,
    doorOpacity,
    doorRoughness
  ]);

  /**
   * texture properties
   */
  // // to kind of alter the uv mapping, but there might be stretching
  // doorColorTexture.repeat.x = 2
  // doorColorTexture.repeat.y = 3

  // // to turn stretching into a repeat pattern
  // doorColorTexture.wrapS = THREE.RepeatWrapping // S for x
  // doorColorTexture.wrapT = THREE.RepeatWrapping // T for y
  
  // // OR MirroredRepeatWrapping => like a mirror camera filter (converges in the middle)
  // doorColorTexture.wrapS = THREE.MirroredRepeatWrapping
  // doorColorTexture.wrapT = THREE.MirroredRepeatWrapping

  // // offset
  // doorColorTexture.offset.x = 0.5
  // doorColorTexture.offset.y = 0.5

  // // FUN NOTE: try offset with MirroredRepeatWrapping

  // // rotation
  // doorColorTexture.rotation = Math.PI * 0.25
  // // to control pivot point of rotation
  // doorColorTexture.center.x = 0.5 
  // doorColorTexture.center.y = 0.5 

  // // minification filters => blurriness vs sharpness => when zoomed out, or texture too big for geometry
  // doorColorTexture.minFilter = THREE.NearestFilter // can cause moire pattern with some textures

  // // magnification filters => blurriness vs sharpness => when zoomed in, or texture too small for geometry
  // // similar to creating minecraft boxes from extremely small texture images
  // doorColorTexture.magFilter = THREE.NearestFilter // will make it sharp and remove pixel stretching

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}>
      <Canvas
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
        camera={{
          fov: 45,
          // position: [1, 1, 8],
          near: 0.1,
          far: 2000
        }}>
        <axesHelper args={[10]} />
        <OrbitControls dampingFactor={0.05} />
        <Camera box={box} />

        <mesh
          ref={box}
          rotation={[Math.PI * 0.25, Math.PI * 0.25, 0, 'YXZ']}
          position={[2, 1, 1]}
          scale={[0.5, 0.5, 0.5]}>
          <axesHelper args={[3]} />
          <boxBufferGeometry args={[1, 2, 3, 2, 2, 2]} />
          <meshBasicMaterial attach="material" map={doorColorTexture} />
        </mesh>
        <mesh position={[0, 1, 0]}>
          {/* easy way to create a triangle, provide 1 to the second arg */}
          <circleBufferGeometry args={[1, 1]} />
          <meshBasicMaterial wireframe color="hotpink" />
        </mesh>
      </Canvas>
    </div>
  );
}

export default Textures;
