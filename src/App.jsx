import './App.scss';
import './Leva.css';
import { Suspense, useEffect, useLayoutEffect, useRef, useState, lazy } from 'react';
import gsap from 'gsap';
import CustomLoader from './components/CustomLoader';
import Sidebar from './components/Sidebar';
import MyRoutes from './components/MyRoutes'

/**
 * Scene Imports
 */
// import PerformanceTips from './lessons/PerformanceTips';
// import ShaderPatterns from './lessons/ShaderPatterns';
// import HauntedHouse from './lessons/HauntedHouse';
// import Particles from './lessons/Particles';
// import GalaxyGenerator from './lessons/GalaxyGenerator';
// import Template from './lessons/Template';
// import RayCaster from './lessons/RayCaster';
// import Physics from './lessons/Physics';
// import RagingSea from './lessons/RagingSea';
// import AnimatedGalaxy from './lessons/AnimatedGalaxy';
// import ModifiedMaterials from './lessons/ModifiedMaterials';
// import PostProcessing from './lessons/PostProcessing';
// import RealisticRendering from './lessons/RealisticRendering';
// import CanvasLoader from './lessons/CanvasLoader';
// import HtmlWithWebGL from './lessons/HtmlWithWebGL';
// import Shaders from './lessons/Shaders';



function App() {
  const app = useRef();
  const [loaded, setLoaded] = useState(false);
  // const [ready, setReady] = useState(false);

  // useEffect(() => {
  //     if (loaded) {
  //       gsap.to(app.current, {
  //         duration: 0.5,
  //         opacity: 1,
  //         delay: 0.5
  //       });
  //     }
  // }, [loaded]);

  // useEffect(() => {
  //   app.current &&
  //     gsap.to(app.current, {
  //       duration: 1,
  //       opacity: 1,
  //       delay: 0.5
  //     });
  // }, [app]);

  return (
    <div ref={app} className="app">

      <Suspense fallback={ <CustomLoader /> }>
        <Sidebar />   {/* Sidebar */}
        <MyRoutes />
  



        {/* <Suspense fallback={<CustomLoader />}>
          <HtmlWithWebGL />
        </Suspense> */}
      </Suspense>
            </div>
  );
}

export default App;
