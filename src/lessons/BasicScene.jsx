import React, { useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, TrackballControls } from '@react-three/drei';
import gsap from 'gsap';

// import * as THREE from 'three';
// const lookAtRef = new THREE.Vector3();

// the camera must be used in a component inside the Canvas component
function Camera({ box, group }) {
  const { camera } = useThree();
  // console.log(camera);
  // console.log(box.current?.position.distanceTo(camera.position));

  ///// lookAt() method
  // the box is moving and camera is following
  useFrame((state, delta) => {
    // if (group.current.position.x > 3) {
    //   group.current.position.x = -3;
    // } else {
    //   group.current.position.x += delta * 1;
    // }
    // delta is explained in notes at bottom of page
  });

  useFrame((state) => {
    // clock is another way to normalize animations framerate
    const { elapsedTime } = state.clock;

    // multiplied by Math.PI * 2 will give one whole rotation per second
    // group.current.rotation.y = elapsedTime * Math.PI * 2;
    // slower rotation below
    // group.current.rotation.y = elapsedTime;

    // Math.sin creates a back and forth wave
    // sin & cos combination will make object rotate (move) in a circle
    //// CIRCLE MOTION ⬇️⬇️⬇️⬇️
    // group.current.position.y = Math.sin(elapsedTime);
    // group.current.position.x = Math.cos(elapsedTime);
    //// CIRCLE MOTION ⬆️⬆️⬆️⬆️
    // group.current.position.y = Math.tan(elapsedTime);

    // sin => pronounced sign (starts at 0)
    // cos => cosign (starts at 1)
    // both give kind of similar wave effect
    // tan => tangent, gives a completely different effect
  });

  useFrame((state) => {
    gsap.to(box.current.position, {
      duration: 0.5,
      x: state.mouse.x * 0.25,
      y: state.mouse.y * 0.25
    });
    gsap.to(box.current.rotation, {
      duration: 0.5,
      x: state.mouse.y * -0.25,
      y: -(state.mouse.x * -0.25)
    });

    // camera motion
    // gsap.to(state.camera.position, {
    //   duration: 0.5,
    //   x: state.mouse.x * 2,
    //   y: state.mouse.y * 2
    // });

    // full circular camera motion
    // gsap.to(state.camera.position, {
    //   duration: 0.5,
    //   x: Math.sin(state.mouse.x / 2 * Math.PI * 2) * 3,
    //   z: Math.cos(state.mouse.x / 2 * Math.PI * 2) * 3,
    //   y: state.mouse.y * Math.PI * 2
    // });
  });

  // useFrame helps in accessing the camera
  useFrame((state) => {
    // lookAtRef.x = group.current.position.x;
    // state.camera.position.y = Math.sin(state.clock.elapsedTime);
    // state.camera.position.x = Math.cos(state.clock.elapsedTime);
    state.camera.lookAt(group.current.position);
  });
  //// using lookAt() outside useFrame() didn't work for me
  //// lookAt() works on any object, it makes its -z face look at another object

  return null;
}

function BasicScene() {
  const box = useRef();
  const group = useRef();
  const canvas = useRef();

  function log() {
    // console.log(box.current.position);
    // length() is the distance between the center of the scene and the object
    // console.log(box.current.position.length());

    // position.distanceTo(arg) => arg is a Vector3
    // such as position.distanceTo(camera.position)
    // such as position.distanceTo(new THREE.Vector3(1, 0, 3))

    // will reduce the length() (distance from center) to 1
    // box.current.position.normalize();
    // console.log(box.current.position.length());

    // set changes x, y, z coords
    // box.current.position.set(2, 2, 2)
    // box.current.scale.set(2, 2, 2)
    /// OR target a specific axis => box.current.scale.x

    // this is another way to change rotation order
    // but rotation values must be updated for it to take effect
    console.log(box.current.rotation.order);
    if (box.current.rotation.order === 'XYZ') {
      box.current.rotation.reorder('YXZ');
    } else {
      box.current.rotation.reorder('XYZ');
    }
    box.current.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0);

    // axesHelper causes onClick issues, calls the function multiple times
  }

  return (
    // the canvas will take full size of its parent
    <div
      ref={canvas}
      style={{ height: '100vh', backgroundColor: 'rgb(26, 26, 26)' }}
      onDoubleClick={() => {
        if (!document.fullscreenElement) {
          canvas.current.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }}>
      {/* default camera fov is 75 approximately */}
      <Canvas
        // some screens have a higher dpr than 1,
        // this attribute will scale default dpr (1) to match the screen
        // otherwise, edges will be jagged
        // Math.min here will limit max value to 2, in case dpr was higher
        // most screens have a dpr of 1, more than 2 is overkill
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
        // decide camera settings at beginning of project
        camera={{
          // fov best between 45 and 75, and the latter is a lot
          fov: 45,
          position: [1, 1, 5],
          // objects between near and far are the ones captured by the camera
          near: 0.1,
          // even 100 for far is considered a lot
          far: 2000
        }}
        //// for a little better 3d object shapes, add this to left and right
        //// ... to increase horizontal fov
        //// aspectRatio = width / height
        //// left: -1 * aspectRatio => -1.33333
        //// right: 1 * aspectRatio =>  1.33333
        // orthographic
        // camera={{
        //   left: -1,
        //   right: 1,
        //   top: 1,
        //   bottom: -1,
        //   near: 1,
        //   far: 1000,
        //   zoom: 50,
        //   position: [0, 5, 10]
        // }}
      >
        <axesHelper args={[10]} />
        <OrbitControls
          // the lower the smoother
          dampingFactor={0.05}
        />
        {/* <TrackballControls /> */}
        <Camera box={box} group={group} />
        <group
          // changes properties of what's inside the group combined
          ref={group}
          position={[1, 1, 1]}
          scale={[0.7, 0.7, 0.7]}
          rotation={[0, 0, 0]}>
          <axesHelper args={[5]} />
          <mesh
            ref={box}
            onClick={log}
            // Math.PI is equal to 180 degrees rotation (half rotation)
            // quarter rotation => Math.PI / 2 OR Math.PI * 0.5
            // read notes at bottom of page for advanced rotation
            rotation={[Math.PI * 0.25, Math.PI * 0.25, 0, 'YXZ']}
            position={[1, 1, 1]}
            // scale prop overrides the geometry args
            scale={[0.5, 0.5, 0.5]}>
            <axesHelper args={[3]} />
            <boxGeometry
              // if args are not specified, defaults are [1, 1, 1]
              args={[1, 1, 1]}
            />
            {/* better way to declare colors is like this "0xff0000" */}
            <meshBasicMaterial color="crimson" />
          </mesh>
          <mesh position={[0, 2, 2]} scale={[0.5, 0.5, 0.5]}>
            <axesHelper args={[3]} />
            <sphereGeometry />
            <meshBasicMaterial color="lime" />
          </mesh>
        </group>
      </Canvas>
    </div>
  );
}

export default BasicScene;

/**
 * gimbal lock is when an axis is not rotating at all
 *
 * in fps games camera, priority is given to y axis before x
 * otherwise, looking left and right can be weird
 * imagine looking left or right while your neck is way down
 * this happens because the order is xyz
 * to fix it, order should be yxz
 * x => up and down
 * y => left and right
 *
 * order is added as fourth parameter to rotation, should be uppercase
 * or by using rotation.reorder() method
 *
 * you'll notice a difference in rotation if order is 'YXZ'
 */

/**
 * requestAnimationsFrame()
 *
 * It is used to execute a callback before the next render
 * to make it execute at a framerate, recursion is needed
 *
 * function tick() {
 *    console.log(tick)
 *
 *    // the callback is the name of the function itself
 *    window.requestAnimationsFrame(tick)
 * }
 * tick()
 *
 * It will not cause a stack overflow, because requestAnimationsFrame
 * is called asynchronously
 */

/**
 * delta is used to normalize animations regardless of screen framerate,
 * because screens with higher framerate will call the requestAnimationsFrame
 * more times per second, making animations faster
 *
 * let time = Date.now()
 * function render() {
 *    const currentTime = Date.now()
 *    const deltaTime = currentTime - time
 *    time = currentTime
 *
 *    object.position.x += 0.001 * deltaTime
 *
 *    window.requestAnimationsFrame(render)
 * }
 * render()
 */

/**
 * orthographic camera has no perspective
 *
 * Think about Age Of Empires, characters have the same size
 * no matter their distance from camera
 */
