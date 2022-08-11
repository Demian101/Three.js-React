import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

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
 * EXAMPLES
 * non-3D text => https://codesandbox.io/embed/troika-3d-text-via-react-three-fiber-ntfx2?fontsize=14
 * 3D text => https://www.ilyameerovich.com/simple-3d-text-meshes-in-three-js/
 */

/**
 * font imports and notes
 *
 * convert font to typeface => https://gero3.github.io/facetype.js/
 * or get fonts from /three/examples/fonts
 */
import typefaceFontFromThree from 'three/examples/fonts/helvetiker_regular.typeface.json';
// or load it from src, notice how License file is in same directory as font
import typefaceFont from '../fonts/helvetiker_regular.typeface.json';

const font = new THREE.FontLoader().parse(typefaceFont);
const textString = `';hello!?<>/*&%$#@!'`;
const textString2 = `!matcaps are dope!`;
const textOptions = {
  font,
  size: 1,
  height: 0.25,
  // default is 12, 4 is good for small text, 6 || 8 is ideal for performance & quality
  curveSegments: 8
};

/**
 * Camera component
 */
function Motion({ textMesh, textMesh2 }) {
  // if not inside a useEffect, will give ref undefined error
  useEffect(() => {
    // easy centering solution instead of computing bounding box and manually translating to -50%'s
    textMesh.current.geometry.center();
    textMesh2.current.geometry.center();
  }, [textMesh, textMesh2]);
  // useFrame(({clock: {elapsedTime}}) => {
  //   textMesh.current.rotation.x = elapsedTime * 0.1
  //   textMesh.current.rotation.y = elapsedTime * 0.1
  //   textMesh.current.rotation.z = elapsedTime * 0.1
  //   textMesh.current.geometry.center()
  // })
  return null;
}

/**
 * Lights component
 */
function Lights() {
  return (
    <>
      <ambientLight args={[0xffffff, 0.5]} />
      <pointLight castShadow args={[0xffffff, 0.5]} position={[2, 3, 4]} />
    </>
  );
}

/**
 * Main Component
 */
function Text() {
  const textMesh = useRef();
  const textMesh2 = useRef();

  const [
    matcap1Texture,
    matcap3Texture,
    matcap7Texture,
    matcap8Texture,
    gradient3Texture,
    gradient5Texture
  ] = useLoader(THREE.TextureLoader, [
    matcap1,
    matcap3,
    matcap7,
    matcap8,
    gradient3,
    gradient5
  ]);

  const matcapMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcap7Texture
  });
  const donut = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const arr = new Array(200).fill(0);

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}>
      <Canvas
        shadows
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
        <Motion textMesh={textMesh} textMesh2={textMesh2} />
        <Lights />

        {/* TEXT MESHES */}
        <mesh ref={textMesh} position={[0, 0.5, 0]}>
          <textBufferGeometry
            // parameters is useful for remembering textOptions, but they must be provided in args as below
            // parameters
            args={[textString, textOptions]}
          />
          <meshStandardMaterial color={'crimson'} />
        </mesh>

        <mesh ref={textMesh2} position={[0, 2, 0]}>
          <textBufferGeometry
            // parameters is useful for remembering textOptions, but they must be provided in args as below
            // parameters
            args={[textString2, textOptions]}
          />
          <meshMatcapMaterial matcap={matcap7Texture} color={'aqua'} />
        </mesh>

        {/* DONUTS */}
        {arr.map((e, i) => {
          console.time('donuts')
          const scale = Math.random();
          return (
            <mesh
              position={[
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
              scale={[scale, scale, scale]}
              geometry={donut}
              material={matcapMaterial}
            />
          );
        })}
        {console.timeEnd('donuts')}
      </Canvas>
    </div>
  );
}

export default Text;
