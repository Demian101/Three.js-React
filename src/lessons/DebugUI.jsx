import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, TrackballControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import * as dat from 'dat.gui';

/**
 * Debug
 */
const gui = new dat.GUI({closed: true, width: 400});
// gui.hide() // hide/unhide by pressing h
// https://jsfiddle.net/ikatyang/182ztwao/ // for more examples

/**
 * Debug Component
 */
function guiAdd(box, material) {
  // everything must be inside an object in order to be added to dat.gui
  const parameters = {
    // color: 'crimson', // this naming convention will cause an error
    color: 0xff0000, // without quotations
    colorAsWell: '#ff0000', // without quotations
    spin: () => {
      gsap.to(box.current.rotation, {
        duration: 1,
        y: box.current.rotation.y + Math.PI * 2,
        ease: 'power2.out'
      })
    }
  };

  // console.log(box)
  gui.add(
    // object name
    box.current.position,
    // concerned property as a string
    'x',
    // min
    -3,
    // max
    3,
    // step (precision)
    0.01
  );
  gui.add(box.current.position, 'y', -3, 3, 0.01);
  // or a cleaner way ⬇️
  gui
    .add(box.current.position, 'z')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('boxPositionZ');

  gui.add(box.current, 'visible').name('boxVisibility');

  gui.add(box.current.material, 'wireframe').name('boxWireframe');

  // the color property is an instance of the Color class in three
  // ... so we cannot tweak it directly, we need a trick
  gui.addColor(parameters, 'color');
  gui.addColor(parameters, 'colorAsWell').onChange(() => {
    box.current.material.color.set(parameters.colorAsWell);
  });

  gui.add(parameters, 'spin');
}

/**
 * Main Component
 */
function DebugUI() {
  const box = useRef();

  // or we can access it through box.current.material
  const material = useRef();

  useEffect(() => {
    setTimeout(() => {
      guiAdd(box, material);
    }, 100);
  }, []);

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}>
      <Canvas
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
        camera={{
          fov: 45,
          position: [1, 1, 8],
          near: 0.1,
          far: 2000
        }}>
        <axesHelper args={[10]} />
        <OrbitControls dampingFactor={0.05} />

        <mesh
          ref={box}
          rotation={[Math.PI * 0.25, Math.PI * 0.25, 0, 'YXZ']}
          position={[2, 1, 1]}
          scale={[0.5, 0.5, 0.5]}>
          <axesHelper args={[3]} />
          <boxBufferGeometry args={[1, 2, 3, 2, 2, 2]} />
          <meshBasicMaterial ref={material} wireframe color="crimson" />
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

export default DebugUI;
