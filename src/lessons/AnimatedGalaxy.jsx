import React, { useRef, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Stats, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useControls, Leva, folder } from 'leva';

// shader imports
/* eslint-disable import/no-webpack-loader-syntax */
import vertexShader from '!!raw-loader!./shaders/galaxy/vertex.vs.glsl';
import fragmentShader from '!!raw-loader!./shaders/galaxy/fragment.fs.glsl';

const GalaxyShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uSize: 0,
    uSizeAttenuation: true
  },
  `${vertexShader}`,
  `${fragmentShader}`
);

extend({ GalaxyShaderMaterial });

function Galaxy() {
  const particlesMesh = useRef();
  const particlesShader = useRef();

  const {
    size,
    sizeAttenuation,
    depthWrite,
    blending,
    count,
    radius,
    branches,
    spin,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor
  } = useControls({
    particlesMat: folder({
      size: { value: 30, min: 0, max: 50.0, step: 0.001 },
      sizeAttenuation: true,
      depthWrite: false,
      blending: true
    }),
    particlesGeo: folder({
      count: { value: 100000, min: 0, max: 200000, step: 1 },
      radius: { value: 5, min: 1, max: 20, step: 0.01 },
      branches: { value: 3, min: 2, max: 20, step: 1 },
      spin: { value: 0.2, min: -3, max: 3, step: 0.0001 },
      randomness: { value: 0.75, min: 0, max: 2, step: 0.001 },
      randomnessPower: { value: 3, min: 1, max: 10, step: 0.001 },
      insideColor: '#F13800',
      outsideColor: '#0033B4'
    })
  });

  // for custom geometry particles
  const particlesGeometry = customParticleGeometry({
    count,
    radius,
    branches,
    spin,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor
  });

  useFrame(
    ({ clock: { elapsedTime } }) =>
      (particlesShader.current.uTime = elapsedTime)
  );

  return (
    <points
      ref={particlesMesh}
      geometry={particlesGeometry}
      geometry-size={0.02}
    >
      <galaxyShaderMaterial
        ref={particlesShader}
        depthWrite={depthWrite}
        vertexColors={true} // will add color attribute to geo
        blending={blending ? THREE.AdditiveBlending : THREE.NormalBlending}
        // uniforms
        // for better results across screen with a high pixel ratio
        // uSize={size * renderer||gl.getPixelRatio()}
        // ... because particles can look smaller if screen has higher pixel ratio
        uSize={size}
        uSizeAttenuation={sizeAttenuation}
        // uTime => assigned in useFrame callback
      />
      <AnimateParticles particles={particlesMesh} />
    </points>
  );
}
/**
 * Main Component
 */
function AnimatedGalaxy() {
  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(0,0,0)' }}>
      <Canvas
        camera={{
          fov: 45,
          position: [0, 3, 3],
          near: 0.1,
          far: 2000
        }}
      >
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />

        {/* Galaxy */}
        <Galaxy />
      </Canvas>
      <Stats />
      <Leva />
    </div>
  );
}

export default AnimatedGalaxy;

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
  // geo
  const geo = new THREE.BufferGeometry();

  // attributes
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count * 1);
  const randomnessArray = new Float32Array(count * 3);

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
    let spinAngle = spin * randomRadius;
    // eliminate spin for this file
    // spin = 0;

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
      Math.pow(randomness, pow) *
      randomRadius;
    const randomY =
      Math.pow(Math.random(), pow) *
      (Math.random() < 0.5 ? -1 : 1) *
      Math.pow(randomness, pow) *
      randomRadius;
    const randomZ =
      Math.pow(Math.random(), pow) *
      (Math.random() < 0.5 ? -1 : 1) *
      Math.pow(randomness, pow) *
      randomRadius;

    // randomnessArray
    randomnessArray[i3 + 0] = randomX;
    randomnessArray[i3 + 1] = randomY;
    randomnessArray[i3 + 2] = randomZ;

    // positions x, y, z
    // apply randomness in the shader, not here
    positions[i3 + 0] =
      Math.cos(angle + spinAngle) * randomRadius /* + randomX */;
    positions[i3 + 1] = 0.0 /* + randomY */;
    positions[i3 + 2] =
      Math.sin(angle + spinAngle) * randomRadius /* + randomZ */;

    // Colors
    const mixedColor = colorInside.clone(); // we clone to prevent mutating
    mixedColor.lerp(colorOutside, randomRadius / radius);

    // colors r, g, b
    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    // random scale
    scales[i] = Math.random();
  }

  // setting attributes
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('aRandomScale', new THREE.BufferAttribute(scales, 1));
  geo.setAttribute(
    'aRandomness',
    new THREE.BufferAttribute(randomnessArray, 3)
  );
  return geo;
}
