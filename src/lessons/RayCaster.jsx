import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * DatGui Import and Styles
 */
import 'react-dat-gui/dist/index.css';
import DatGui, {
  DatFolder,
  DatColor,
  DatNumber,
  DatSelect,
  DatBoolean
} from 'react-dat-gui';

/**
 * Ray Caster Usage
 *  1. detect wall in front of player
 *  2. test if laser gun hit something
 *  3. test if something is currently under the mouse to simulate mouse events
 *  4. show an alert message if the spaceship is heading toward a planet
 */

/**
 * Main Component
 */
function RayCaster() {
  // refs
  const plane = useRef();
  const raycaster = useRef();
  const raycaster2 = useRef();
  const sphere1 = useRef();
  const sphere2 = useRef();
  const sphere3 = useRef();

  // state
  const [opts, setOpts] = useState({
    datGuiWidth: 350
  });

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(0,0,0)' }}>
      <Canvas
        camera={{
          fov: 45,
          position: [7, 2, 7],
          near: 0.1,
          far: 2000
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls />

        {/* PLANE */}
        <mesh ref={plane} rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[10, 10]} />
          <meshBasicMaterial wireframe color={'lightgreen'} />
        </mesh>

        {/* SPHERES */}
        <mesh
          ref={sphere1}
          position={[-2, 0, 0]}
          name="sphere1"
          onClick={() => console.log(sphere1.current.name)}
        >
          <sphereBufferGeometry args={[0.5]} />
          <meshBasicMaterial color={'seagreen'} />
        </mesh>
        <mesh
          ref={sphere2}
          position={[0, 0, 0]}
          name="sphere2"
          onClick={() => console.log(sphere2.current.name)}
        >
          <sphereBufferGeometry args={[0.5]} />
          <meshBasicMaterial color={'seagreen'} />
        </mesh>
        <mesh
          ref={sphere3}
          position={[2, 0, 0]}
          name="sphere3"
          onClick={() => console.log(sphere3.current.name)}
        >
          <sphereBufferGeometry args={[0.5]} />
          <meshBasicMaterial color={'seagreen'} />
        </mesh>
        <SphereMotion spheres={{ sphere1, sphere2, sphere3 }} />

        {/* RAYCASTER */}
        <raycaster
          ref={raycaster}
          // these args must be passed as new instances of Vector3 manually
          args={[
            new THREE.Vector3(-3, 0, 0), // origin
            new THREE.Vector3(10, 0, 0).normalize() // direction, must be normalized
          ]}
        />
        <RayCasterHelper
          raycaster={raycaster}
          spheres={{ sphere1, sphere2, sphere3 }}
        />

        {/* RAYCASTER 2 */}
        <raycaster
          ref={raycaster2}
          // these args must be passed as new instances of Vector3 manually
          args={[
            new THREE.Vector3(-3, 0, 0), // origin
            new THREE.Vector3(10, 0, 0).normalize() // direction, must be normalized
            // or instead of normalizing, make it (1, 0, 0)
          ]}
        />
        {/* <RayCasterHelper2
          raycaster={raycaster2}
          spheres={{ sphere1, sphere2, sphere3 }}
        /> */}
      </Canvas>
      <DebugPanel opts={opts} setOpts={setOpts} />
    </div>
  );
}

export default RayCaster;

// INTERSECTIONS
function RayCasterHelper2({
  raycaster,
  spheres: { sphere1, sphere2, sphere3 }
}) {
  useFrame(({ clock: { elapsedTime } }) => {
    // const intersect1 = raycaster.current.intersectObject(sphere1.current);
    // intersect1.length > 0
    //   ? sphere1.current.material.color.set('crimson')
    //   : sphere1.current.material.color.set('seagreen');

    const testObjects = [sphere1.current, sphere2.current, sphere3.current];
    const intersects = raycaster.current.intersectObjects(testObjects);
    // reverting colors to defaults
    for (const object of testObjects) {
      object.material.color.set('#00ff00');
    }
    // changing colors if intersects
    for (const intersect of intersects) {
      intersect.object.material.color.set('#ff0000');
    }
  });
  return null;
}

// MOUSE HOVER
function RayCasterHelper({
  raycaster,
  spheres: { sphere1, sphere2, sphere3 }
}) {
  /**
   * The Witness Variable => contains if there is a hovered object
   * - If an object intersects 🟢, but there wasn't one before it, a mouseenter happens
   * - If no object intersects 🔴, but there was one before it, a mouseleave happens
   */
  let currentIntersect = null;

  useFrame(({ mouse, camera }) => {
    // attaching raycaster to camera and mouse
    raycaster.current.setFromCamera(mouse, camera);

    // casting the ray
    const testObjects = [sphere1.current, sphere2.current, sphere3.current];
    const intersects = raycaster.current.intersectObjects(testObjects);

    // reverting colors to defaults
    for (const object of testObjects) {
      object.material.color.set('#00ff00');
    }
    // changing colors if intersects
    for (const intersect of intersects) {
      intersect.object.material.color.set('#0000ff');
    }

    // mouse events (enter | leave)
    if (intersects.length) {
      if (!currentIntersect) {
        console.log('mouse enter');
      }
      currentIntersect = intersects[0]; // or simply equals any truthy value
    } else {
      if (currentIntersect) {
        console.log('mouse leave');
      }
      currentIntersect = null;
    }
  });

  // one click event for all intersectable objects
  window.addEventListener('click', () => {
    currentIntersect && console.log('SIMULATION', currentIntersect.object.name);
  });

  // no JSX here
  return null;
}

// SPHERE MOTION
function SphereMotion({ spheres: { sphere1, sphere2, sphere3 } }) {
  useFrame(({ clock: { elapsedTime } }) => {
    // tan is AWESOME 😲
    sphere1.current.position.y = Math.tan(elapsedTime * 0.6) * 0.25;
    sphere2.current.position.y = Math.tan(elapsedTime * 1) * 0.25;
    sphere3.current.position.y = Math.tan(elapsedTime * 1.4) * 0.25;
  });
  return null;
}

// DAT.GUI
function DebugPanel({ opts, setOpts }) {
  return (
    <DatGui
      data={opts}
      onUpdate={setOpts}
      style={{ width: `${opts.datGuiWidth}px` }}
    >
      <DatFolder closed={false} title="Panel">
        <DatNumber
          label="Panel Width"
          path="datGuiWidth"
          min={300}
          max={500}
          step={1}
        />
      </DatFolder>
    </DatGui>
  );
}
