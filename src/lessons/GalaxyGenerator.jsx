import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * DatGui Import and Styles
 * good example => https://codesandbox.io/embed/troika-3d-text-via-react-three-fiber-ntfx2?fontsize=14
 */
// import "react-dat-gui/build/react-dat-gui.css";
import 'react-dat-gui/dist/index.css';
import DatGui, {
  DatFolder,
  DatColor,
  DatNumber,
  DatSelect,
  DatBoolean
} from 'react-dat-gui';

// PARTICLE IMPORTS
import p1 from '../textures/particles/1.png';
import p2 from '../textures/particles/2.png';
import p3 from '../textures/particles/3.png';
import p4 from '../textures/particles/4.png';
import p5 from '../textures/particles/5.png';
import p6 from '../textures/particles/6.png';
import p7 from '../textures/particles/7.png';
import p8 from '../textures/particles/8.png';
import p9 from '../textures/particles/9.png';
import p10 from '../textures/particles/10.png';
import p11 from '../textures/particles/11.png';
import p12 from '../textures/particles/12.png';
import p13 from '../textures/particles/13.png';

/**
 * Main Component
 */
function GalaxyGenerator() {
  // refs
  const particledSphere = useRef();
  const particles = useRef();

  // particle textures
  const [p1T, p2T, p3T, p4T, p5T, p6T, p7T, p8T, p9T, p10T, p11T, p12T, p13T] =
    useLoader(THREE.TextureLoader, [
      p1,
      p2,
      p3,
      p4,
      p5,
      p6,
      p7,
      p8,
      p9,
      p10,
      p11,
      p12,
      p13
    ]);

  const [opts, setOpts] = useState({
    particlesMat: {
      size: 0.01,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
      // color: 'white',
    },
    particlesGeo: {
      count: 100000,
      radius: 5,
      branches: 3,
      spin: 1,
      randomness: 1,
      randomnessPower: 3,
      insideColor: '#F13800',
      outsideColor: '#0033B4'
    },
    debugPanelWidth: 350
  });

  // for custom geometry particles
  const particlesGeo = customParticleGeometry(opts.particlesGeo);

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(0,0,0)' }}>
      <Canvas
        camera={{
          fov: 45,
          position: [0, 7, 7],
          near: 0.1,
          far: 2000
        }}
      >
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />

        {/* CUSTOM GEOMETRY PARTICLE */}
        <points ref={particles} geometry={particlesGeo} geometry-size={0.02}>
          <pointsMaterial {...opts.particlesMat} />
          <AnimateParticles particles={particles} />
        </points>
      </Canvas>
      <DebugPanel opts={opts} setOpts={setOpts} />
    </div>
  );
}

export default GalaxyGenerator;

function DebugPanel({ opts, setOpts }) {
  return (
    <>
      <DatGui
        data={opts}
        onUpdate={setOpts}
        style={{ width: `${opts.debugPanelWidth}px` }}
      >
        <DatFolder closed={false} title="Panel">
          <DatNumber
            label="Panel Width"
            path="debugPanelWidth"
            min={300}
            max={500}
            step={1}
          />
        </DatFolder>
        <DatFolder closed={false} title="Particles">
          <DatNumber
            label="size"
            path="particlesMat.size"
            min={0}
            max={0.1}
            step={0.001}
          />
          {/* <DatSelect label="texture" path="particlesMat.alphaMap" options={Object.keys(opts.particlesTexture)} /> */}
          <DatNumber
            label="Count"
            path="particlesGeo.count"
            min={0}
            max={200000}
            step={1}
          />
          <DatNumber
            label="Radius"
            path="particlesGeo.radius"
            min={1}
            max={20}
            step={0.01}
          />
          <DatNumber
            label="Branches"
            path="particlesGeo.branches"
            min={2}
            max={20}
            step={1}
          />
          <DatNumber
            label="Spin"
            path="particlesGeo.spin"
            min={-3}
            max={3}
            step={0.001}
          />
          <DatNumber
            label="Randomness"
            path="particlesGeo.randomness"
            min={0}
            max={2}
            step={0.001}
          />
          <DatNumber
            label="Randomness Power"
            path="particlesGeo.randomnessPower"
            min={1}
            max={10}
            step={0.001}
          />
          <DatColor label="Inside Color" path="particlesGeo.insideColor" />
          <DatColor label="Outside Color" path="particlesGeo.outsideColor" />
        </DatFolder>
      </DatGui>
    </>
  );
}

function AnimateParticles({ particles }) {
  useFrame(({ clock: { elapsedTime }, camera }) => {
    particles.current.rotation.y = elapsedTime * 0.05;
    particles.current.rotation.z = elapsedTime * 0.001;
    // camera.rotation.z = elapsedTime * 0.01;
  });
  return null;
}

function customParticleGeometry({
  count,
  branches,
  radius,
  spin,
  randomness,
  randomnessPower: pow,
  insideColor,
  outsideColor
}) {
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorInside = new THREE.Color(insideColor);
  const colorOutside = new THREE.Color(outsideColor);

  // // will give perfect mix of the two, but will mutate first variable
  // colorInside.lerp(colorOutside, 0.5);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const randomRadius = Math.random() * radius;

    // example: if branches is 3 ⬇️
    // i               => 0  1   2  3  4   5  6  7  8   9
    // angleModulo     => 0  1   2  0  1   2  0  1  2   0
    // anglePercentage => 0 .33 .66 0 .33 .66 0 .33 .66 0
    // angle           => the real angle value on the circle
    const angleModulo = i % branches;
    const anglePercentage = angleModulo / branches;
    const angle = anglePercentage * Math.PI * 2;

    // spin
    const spinAngle = spin * randomRadius;

    // randomness
    // multiplied by randomRadius to decrease randomness in the center, and increase with distance from center
    // const randomX = (Math.random() - 0.5) * randomness * randomRadius;
    // const randomY = (Math.random() - 0.5) * randomness * randomRadius;
    // const randomZ = (Math.random() - 0.5) * randomness * randomRadius;

    // more randomness
    // pow === randomnessPower
    const randomX =
      Math.pow(Math.random(), pow) *
      (Math.random() < 0.5 ? -1 : 1) *
      Math.pow(randomness, pow);
    const randomY =
      Math.pow(Math.random(), pow) *
      (Math.random() < 0.5 ? -1 : 1) *
      Math.pow(randomness, pow);
    const randomZ =
      Math.pow(Math.random(), pow) *
      (Math.random() < 0.5 ? -1 : 1) *
      Math.pow(randomness, pow);

    // positions x, y, z
    positions[i3 + 0] = Math.cos(angle + spinAngle) * randomRadius + randomX;
    positions[i3 + 1] = Math.random() * randomness * randomY;
    positions[i3 + 2] = Math.sin(angle + spinAngle) * randomRadius + randomZ;

    // Colors
    const mixedColor = colorInside.clone(); // we clone to prevent mutating
    mixedColor.lerp(colorOutside, randomRadius / radius);

    // colors r, g, b
    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  // setting position attribute
  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return particlesGeometry;
}
