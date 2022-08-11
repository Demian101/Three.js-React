/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF('./burger/Burger.glb');

  // instead of applying it manually to each material
  for (const key in materials) {
    const material = materials[key];
    // to not apply it to MeshBasicMaterial
    if (material instanceof MeshStandardMaterial) {
      material.envMap = props.envMap;
      material.envMapIntensity = props.envMapIntensity;
    }
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={[0.25, 0.25, 0.25]}>
        <mesh
          castShadow={props.shadows}
          receiveShadow={props.shadows}
          geometry={nodes.Cube.geometry}
          material={nodes.Cube.material}
        />
        <mesh
          castShadow={props.shadows}
          receiveShadow={props.shadows}
          geometry={nodes.Cube001.geometry}
          material={materials.meatMaterial}
          position={[0, 1.83, 0]}
        />
        <mesh
          castShadow={props.shadows}
          receiveShadow={props.shadows}
          geometry={nodes.Plane.geometry}
          material={materials.cheeseMaterial}
          position={[0, 3.92, 0]}
        />
        <mesh
          castShadow={props.shadows}
          receiveShadow={props.shadows}
          geometry={nodes.Cube002.geometry}
          material={nodes.Cube002.material}
          position={[0, 5.9, 0]}
          rotation={[0, 0, Math.PI]}
        />
      </group>
    </group>
  );
}

useGLTF.preload('./burger/Burger.glb');