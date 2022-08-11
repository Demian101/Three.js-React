import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls, Leva, folder } from 'leva';
import DamagedHelmetModel from '../generatedModels/DamagedHelmet';

// POSTPROCESSING Imports
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
  DotScreen,
  Glitch,
  ChromaticAberration,
  Pixelation,
  Scanline,
  SSAO,
  Sepia,
  GodRays,
  SMAA
} from '@react-three/postprocessing';
import {
  BlendFunction,
  GlitchMode,
  Resizer,
  KernelSize,
  BlurPass
} from 'postprocessing';
// Custom Effects
import { TintCustomEffect } from './customEffects/TintCustomEffect';

// env imports
import px from '../textures/environmentMaps/3/px.jpg';
import nx from '../textures/environmentMaps/3/nx.jpg';
import py from '../textures/environmentMaps/3/py.jpg';
import ny from '../textures/environmentMaps/3/ny.jpg';
import pz from '../textures/environmentMaps/3/pz.jpg';
import nz from '../textures/environmentMaps/3/nz.jpg';

/**
 * Effects Component
 */
function Effects() {
  const effectComposer = useRef();
  const { gl } = useThree();
  const customEffect = useRef();

  const { red, green, blue } = useControls({
    customTint: folder({
      red: 0.5,
      green: 0.0,
      blue: 0.5
    })
  })

  // if pixelRatio > 1, no need for multisampling (MSAA)
  const pixelRatio = gl.getPixelRatio();
  // if false, browser does not support multisampling (maybe Safari/iOS if not newest version)
  const isWebGL2 = gl.capabilities.isWebGL2;

  // useEffect(() => {
  //   console.log(effectComposer.current);
  //   // default multisampling = 8 // taken from effectComposer properties
  // }, [effectComposer]);

  useEffect(() => {
    console.log(customEffect.current);
  }, [customEffect]);

  return (
    <EffectComposer
      ref={effectComposer}
      multisampling={!isWebGL2 ? 0 : pixelRatio > 1 ? 0 : 8}
    >
      {/* enable SMAA if WebGL2 isn't supported. Do not confuse MSAA with SMAA */}
      {!isWebGL2 && pixelRatio === 1 && <SMAA />}

      {/* EFFECTS */}
      {/* <DepthOfField
        focusDistance={0}
        focalLength={0.02}
        bokehScale={2}
        height={480}
      />
      <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
      {/* <DotScreen scale={2.0} angle={Math.PI / 2} blendFunction={BlendFunction.NORMAL} /> */}
      {/* <Glitch
        delay={[1.5, 3.5]} // min and max glitch delay
        duration={[0.2, 0.5]} // min and max glitch duration
        strength={[0.1, 0.3]} // min and max glitch strength
        mode={GlitchMode.SPORADIC} // glitch mode
        ratio={0.95} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
        active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
      /> */}
      {/* <ChromaticAberration
        // blendFunction={BlendFunction.NORMAL} // blend mode
        offset={[0.01, 0.001]} // color offset
      /> */}
      {/* <Noise
        premultiply // enables or disables noise premultiplication
        opacity={0.5}
        blendFunction={BlendFunction.NORMAL} // blend mode
      />
      <Pixelation
        granularity={5} // pixel granularity
      />
      <Scanline
        blendFunction={BlendFunction.OVERLAY} // blend mode
        density={2} // scanline density
      /> */}
      {/* <Sepia
        intensity={0.5} // sepia intensity
        blendFunction={BlendFunction.NORMAL} // blend mode
      /> */}
      <Bloom
        intensity={2} // The bloom intensity.
        blurPass={undefined} // A blur pass.
        width={Resizer.AUTO_SIZE} // render width
        height={Resizer.AUTO_SIZE} // render height
        kernelSize={KernelSize.LARGE} // blur kernel size
        luminanceThreshold={0.6} // luminance threshold. Raise this value to mask out darker elements in the scene.
        luminanceSmoothing={0.1} // smoothness of the luminance threshold. Range is [0, 1]
      />
      {/* CUSTOM EFFECT */}
      <TintCustomEffect
        ref={customEffect}
        blendFunction={BlendFunction.NORMAL}
        color={[red, green, blue]} // variables from Leva
        // alpha={0.1} // not working, needs adjusting the blend function in the constructor
      />
    </EffectComposer>
  );
}

/**
 * FlightHelmet Component
 */
function DamagedHelmet({ environmentMapTexture }) {
  const { scale, position, rotationY, envMapIntensity, shadows } = useControls({
    FlightHelmet: folder(
      {
        scale: [2.5, 2.5, 2.5],
        position: [0, 0, 0],
        rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.1 },
        envMapIntensity: { value: 2, min: 0, max: 10, step: 0.1 },
        shadows: true
      },
      {
        collapsed: true
      }
    )
  });
  return (
    <DamagedHelmetModel
      scale={scale}
      position={position}
      rotation={[0, rotationY, 0]}
      envMap={environmentMapTexture}
      envMapIntensity={envMapIntensity}
      shadows={shadows}
    />
  );
}

/**
 * Main Component
 */
function PostProcessing() {
  const [environmentMapTexture] = useLoader(THREE.CubeTextureLoader, [
    [px, nx, py, ny, pz, nz]
  ]);
  // makes lighting and colors much more realistic
  environmentMapTexture.encoding = THREE.sRGBEncoding;
  // Note: do not apply sRGBEncoding on textures such as normals or roughness etc...

  return (
    <div style={{ height: '100vh', backgroundColor: 'black' }}>
      <Canvas
        shadows
        gl={{ physicallyCorrectLights: true }}
        camera={{
          fov: 45,
          position: [0, 2, 12],
          near: 0.1,
          far: 2000
        }}
        onCreated={(canvas) => {
          // console.log(canvas.gl);
          // gl === renderer in vanilla THREE
          // gl.outputEncoding is THREE.sRGBEncoding by default in @react-three/fiber
          // canvas.gl.physicallyCorrectLights = true;
          canvas.scene.background = environmentMapTexture;
        }}
      >
        <OrbitControls />

        {/* MODELS / no need for suspense here as it is provided higher in the tree */}
        <DamagedHelmet environmentMapTexture={environmentMapTexture} />

        {/* EFFECTS */}
        <Effects />

        <Lights />
      </Canvas>
      <Leva />
    </div>
  );
}

export default PostProcessing;

function Lights() {
  const light = useRef();
  const { color, intensity, position, castShadow } = useControls({
    directionalLight: folder(
      {
        color: '#ffffff',
        intensity: { value: 3, min: 0, max: 10, step: 0.01 },
        position: [0.25, 3, 1],
        castShadow: true
      },
      {
        collapsed: true
      }
    )
  });
  return (
    <>
      <directionalLight
        ref={light}
        color={color}
        position={position}
        intensity={intensity}
        castShadow={castShadow}
        shadow-mapSize={[1024, 1024]}
        // tweak normalBias to remove shadow acne on the burger
        // start testing from 0.01 and go up
        // increasing the value too much will create wrong shadows
        // usually, 0.05 is more than enough
        shadow-normalBias={0.02}
        // if surface is flat (not rounded), try using bias instead of normalBias
      />
    </>
  );
}
