import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Leva, useControls, folder } from 'leva';

// Matcap Imports
import matcap1 from '../textures/matcaps/1.png';
import matcap2 from '../textures/matcaps/2.png';
import matcap3 from '../textures/matcaps/3.png';
import matcap4 from '../textures/matcaps/4.png';
import matcap5 from '../textures/matcaps/5.png';
import matcap6 from '../textures/matcaps/6.png';
import matcap7 from '../textures/matcaps/7.png';
import matcap8 from '../textures/matcaps/8.png';

// Gradient Imports
import gradient3 from '../textures/gradients/3.jpg';
import gradient5 from '../textures/gradients/5.jpg';

/**
 * Toon Component
 */
function Toon() {
  const ref = useRef();
  const [hidden, setHidden] = useState();

  // textures
  const [gradient3Texture, gradient5Texture] = useLoader(THREE.TextureLoader, [
    gradient3,
    gradient5
  ]);

  gradient3Texture.magFilter = THREE.NearestFilter;
  gradient5Texture.magFilter = THREE.NearestFilter;

  const {
    color,
    gradientMap,
    radialSegments,
    tubularSegments,
    radius,
    tube,
    position,
    wireframe,
    castShadow,
    rotate,
    html
  } = useControls({
    Toon: folder(
      {
        color: '#219656',
        gradientMap: {
          value: 'threeTone',
          options: ['threeTone', 'fiveTone']
        },
        radialSegments: { value: 16, min: 2, max: 128, step: 1 },
        tubularSegments: { value: 32, min: 2, max: 128, step: 1 },
        radius: { value: 0.3, min: 0.1, max: 5, step: 0.01 },
        tube: { value: 0.2, min: 0.1, max: 5, step: 0.01 },
        position: [0, 1, 1.5],
        wireframe: false,
        castShadow: true,
        rotate: true,
        html: true
      },
      {
        collapsed: true
      }
    )
  });

  useFrame(() => {
    if (rotate) {
      ref.current.rotation.x = ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh castShadow={castShadow} ref={ref} position={position}>
      <torusBufferGeometry
        args={[radius, tube, radialSegments, tubularSegments]}
      />
      <meshToonMaterial
        wireframe={wireframe}
        color={color}
        gradientMap={
          gradientMap === 'threeTone' ? gradient3Texture : gradient5Texture
        }
      />
      {html && (
        <Html
          distanceFactor={3.5}
          position={[0, 0.75, 0]}
          center
          className="donutMaterials"
          occlude
          onOcclude={setHidden}
          style={{
            transition: 'all 0.5s',
            opacity: hidden ? 0 : 1,
            transform: `scale(${hidden ? 0.5 : 1})`
          }}
        >
          <p>Toon</p>
          <p>meshToonMaterial</p>
        </Html>
      )}
    </mesh>
  );
}

/**
 * Phong Component
 */
function Phong() {
  const ref = useRef();
  const [hidden, setHidden] = useState();

  const {
    color,
    specular,
    shininess,
    radialSegments,
    tubularSegments,
    radius,
    tube,
    position,
    wireframe,
    castShadow,
    rotate,
    html
  } = useControls({
    Phong: folder(
      {
        color: '#3269ff',
        specular: '#ff2233',
        shininess: { value: 100, min: 0, max: 1000, step: 1 },
        radialSegments: { value: 16, min: 2, max: 128, step: 1 },
        tubularSegments: { value: 32, min: 2, max: 128, step: 1 },
        radius: { value: 0.3, min: 0.1, max: 5, step: 0.01 },
        tube: { value: 0.2, min: 0.1, max: 5, step: 0.01 },
        position: [-1.5, 1, 0],
        wireframe: false,
        castShadow: true,
        rotate: true,
        html: true
      },
      {
        collapsed: true
      }
    )
  });

  useFrame(() => {
    if (rotate) {
      ref.current.rotation.x = ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh castShadow={castShadow} ref={ref} position={position}>
      <torusBufferGeometry
        args={[radius, tube, radialSegments, tubularSegments]}
      />
      <meshPhongMaterial
        color={color}
        shininess={shininess}
        specular={specular}
        wireframe={wireframe}
      />
      {html && (
        <Html
          distanceFactor={3.5}
          position={[0, 0.75, 0]}
          center
          className="donutMaterials"
          occlude
          onOcclude={setHidden}
          style={{
            transition: 'all 0.5s',
            opacity: hidden ? 0 : 1,
            transform: `scale(${hidden ? 0.5 : 1})`
          }}
        >
          <p>Phong</p>
          <p>meshPhongMaterial</p>
        </Html>
      )}
    </mesh>
  );
}

/**
 * Matcaps Component
 */
function Matcaps() {
  const ref = useRef();
  const [hidden, setHidden] = useState();

  // textures
  const [
    matcap1Texture,
    matcap2Texture,
    matcap3Texture,
    matcap4Texture,
    matcap5Texture,
    matcap6Texture,
    matcap7Texture,
    matcap8Texture
  ] = useLoader(THREE.TextureLoader, [
    matcap1,
    matcap2,
    matcap3,
    matcap4,
    matcap5,
    matcap6,
    matcap7,
    matcap8
  ]);

  const {
    matcap,
    radialSegments,
    tubularSegments,
    radius,
    tube,
    position,
    wireframe,
    castShadow,
    rotate,
    html
  } = useControls({
    Matcaps: folder(
      {
        matcap: { value: 5, options: [1, 2, 3, 4, 5, 6, 7, 8] },
        radialSegments: { value: 16, min: 2, max: 128, step: 1 },
        tubularSegments: { value: 32, min: 2, max: 128, step: 1 },
        radius: { value: 0.3, min: 0.1, max: 5, step: 0.01 },
        tube: { value: 0.2, min: 0.1, max: 5, step: 0.01 },
        position: [0, 1, -1.5],
        wireframe: false,
        castShadow: true,
        rotate: true,
        html: true
      },
      {
        collapsed: true
      }
    )
  });

  useFrame(() => {
    if (rotate) {
      ref.current.rotation.x = ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh castShadow={castShadow} ref={ref} position={position}>
      <torusBufferGeometry
        args={[radius, tube, radialSegments, tubularSegments]}
      />
      <meshMatcapMaterial
        wireframe={wireframe}
        matcap={
          matcap === 1
            ? matcap1Texture
            : matcap === 2
            ? matcap2Texture
            : matcap === 3
            ? matcap3Texture
            : matcap === 4
            ? matcap4Texture
            : matcap === 5
            ? matcap5Texture
            : matcap === 6
            ? matcap6Texture
            : matcap === 7
            ? matcap7Texture
            : matcap8Texture
        }
      />
      {html && (
        <Html
          distanceFactor={3.5}
          position={[0, 0.75, 0]}
          center
          className="donutMaterials"
          occlude
          onOcclude={setHidden}
          style={{
            transition: 'all 0.5s',
            opacity: hidden ? 0 : 1,
            transform: `scale(${hidden ? 0.5 : 1})`
          }}
        >
          <p>matcaps</p>
          <p>meshMatcapMaterial</p>
        </Html>
      )}
    </mesh>
  );
}

/**
 * Normals Component
 */
function Normals() {
  const ref = useRef();
  const [hidden, setHidden] = useState();

  const {
    radialSegments,
    tubularSegments,
    radius,
    tube,
    position,
    wireframe,
    castShadow,
    rotate,
    html
  } = useControls({
    Normals: folder(
      {
        radialSegments: { value: 16, min: 2, max: 128, step: 1 },
        tubularSegments: { value: 32, min: 2, max: 128, step: 1 },
        radius: { value: 0.3, min: 0.1, max: 5, step: 0.001 },
        tube: { value: 0.2, min: 0.1, max: 5, step: 0.001 },
        position: [1.5, 1, 0],
        wireframe: false,
        castShadow: true,
        rotate: true,
        html: true
      },
      {
        collapsed: true
      }
    )
  });

  useFrame(() => {
    if (rotate) {
      ref.current.rotation.x = ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh castShadow={castShadow} ref={ref} position={position}>
      <torusBufferGeometry
        args={[radius, tube, radialSegments, tubularSegments]}
      />
      <meshNormalMaterial flatShading={true} wireframe={wireframe} />
      {html && (
        <Html
          distanceFactor={3.5}
          position={[0, 0.75, 0]}
          center
          className="donutMaterials"
          occlude
          onOcclude={setHidden}
          style={{
            transition: 'all 0.5s',
            opacity: hidden ? 0 : 1,
            transform: `scale(${hidden ? 0.5 : 1})`
          }}
        >
          <p>Normals</p>
          <p>meshNormalMaterial</p>
        </Html>
      )}
    </mesh>
  );
}

/**
 * Plane Component
 */
function Plane() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry args={[50, 50]} />
      <meshStandardMaterial side={THREE.DoubleSide} color={'orangered'} />
    </mesh>
  );
}

/**
 * Main Component
 */
function Materials() {
  const { autoRotate } = useControls({
    OrbitControls: folder({
      autoRotate: false
    })
  });

  return (
    <div style={{ height: '100vh', backgroundColor: '#C01805' }}>
      <Canvas
        shadows
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
        camera={{
          fov: 45,
          position: [4, 4, 4],
          near: 0.1,
          far: 2000
        }}
      >
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls dampingFactor={0.05} autoRotate={autoRotate} />

        {/* plane */}
        <Plane />

        {/* Donuts */}
        <Normals />

        <Matcaps />

        <Phong />

        <Toon />

        <Lights />
      </Canvas>
      <Leva />
    </div>
  );
}

export default Materials;

/**
 * Lights component
 */
function Lights() {
  return (
    <>
      <hemisphereLight args={[0xe1e1e1, 0xe1e1e1, 0.5]} />
      <pointLight
        shadow-mapSize={[1024, 1024]}
        castShadow
        args={[0xe1e1e1, 1, 20, 1]}
        position={[2, 3, 4]}
      />
    </>
  );
}
