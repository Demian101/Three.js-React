import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, TrackballControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// // custom geometry not working, either declaratively or imperatively
// const geo = new Geometry()
// geo.vertices.push(
//   new THREE.Vector3(0,0,0),
//   new THREE.Vector3(0,1,0),
//   new THREE.Vector3(1,0,0),
// )
// geo.faces.push(
//   new Face3(0,1,2)
// )

// const shapeVertices = [
//   [0, 0, 0],
//   [0, 1, 0],
//   [1, 0, 0]
// ];

// const shapeFaces = [
//   [0, 1, 2]
//   // [0, 1, 0],
//   // [1, 0, 0]
// ];

// // cool thing about bufferGeometry is that we don't have to provide faces
const positionsArray = new Float32Array([
  // first vertex
  0, 0, 0,
  // second vertex
  0, 1, 0,
  // third vertex
  1, 0, 0
]);
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// instead of setting the attribute here
// ... we provide it in the props in the bufferGeometry JSX element
// const geo = new THREE.BufferGeometry()
// geo.setAttribute('position', positionsAttribute)

const count = 500; // number of triangle we want
// count * 3 (number of vertices) * 3 (x, y, z)
const positionsArray2 = new Float32Array(count * 3 * 3);
for (let i = 0; i < positionsArray2.length; i++) {
  positionsArray2[i] = (Math.random() - 0.5) * 2
}
const positionsAttribute2 = new THREE.BufferAttribute(positionsArray2, 3)

function Camera({ box, group }) {
  return null;
}

function Geometries() {
  const box = useRef();
  const group = useRef();

  // const vertices = useMemo(
  //   () => shapeVertices.map((v) => new THREE.Vector3(...v)),
  //   []
  // );
  // const faces = useMemo(() => shapeFaces.map((f) => new Face3(...f)), []);

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
        <Camera box={box} group={group} />

        <mesh
          ref={box}
          rotation={[Math.PI * 0.25, Math.PI * 0.25, 0, 'YXZ']}
          position={[2, 1, 1]}
          scale={[0.5, 0.5, 0.5]}>
          <axesHelper args={[3]} />
          <boxBufferGeometry args={[1, 2, 3, 2, 2, 2]} />
          <meshBasicMaterial wireframe color="crimson" />
        </mesh>

        <mesh position={[0, 1, 0]}>
          {/* easy way to create a triangle, provide 1 to the second arg */}
          <circleBufferGeometry args={[1, 1]} />
          <meshBasicMaterial wireframe color="hotpink" />
        </mesh>

        <mesh position={[0, 1, 1.25]}>
          <bufferGeometry attributes={{ position: positionsAttribute }} />
          <meshBasicMaterial wireframe color="aqua" />
        </mesh>

        <mesh position={[0, 1, 2.5]}>
          <bufferGeometry attributes={{ position: positionsAttribute2 }} />
          <meshBasicMaterial wireframe color="goldenrod" />
        </mesh>

        {/* custom geometry not working */}
        {/* <mesh geometry={geo} position={[0, 1, 2]}>
          <axesHelper args={[3]} />
          <geometry
            attach="geometry"
            vertices={vertices}
            faces={faces}
          />
          <meshBasicMaterial attach="material" color="lime" />
        </mesh> */}
      </Canvas>
    </div>
  );
}

export default Geometries;
