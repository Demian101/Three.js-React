import { Routes, Route } from 'react-router-dom' // unstable_HistoryRouter as HistoryRouter,
import { lazy } from 'react';

// import ImportedModels from './lessons/ImportedModels';
const ImportedModels  = lazy(() => import('../lessons/ImportedModels'))
const Text  = lazy(() => import('../lessons/Text'))  // import Text from './lessons/Text';
const Lights  = lazy(() => import('../lessons/Lights')) // import Lights from './lessons/Lights';
const Materials  = lazy(() => import('../lessons/Materials'))  // import Materials from './lessons/Materials';
const BakingShadows = lazy(() => import('../lessons/BakingShadows'))
const HtmlWithWebGL = lazy(() => import('../lessons/HtmlWithWebGL'))
const PerformanceTips = lazy(() => import('../lessons/PerformanceTips'))
const CanvasLoader = lazy(() => import('../lessons/CanvasLoader'))
const PostProcessing = lazy(() => import('../lessons/PostProcessing'))
const ModifiedMaterials = lazy(() => import('../lessons/ModifiedMaterials'))
const Shaders = lazy(() => import('../lessons/Shaders'))
const ShaderPatterns = lazy(() => import('../lessons/ShaderPatterns'))
const RagingSea = lazy(() => import('../lessons/RagingSea'))
const AnimatedGalaxy = lazy(() => import('../lessons/AnimatedGalaxy'))
const RealisticRendering = lazy(() => import('../lessons/RealisticRendering'))
const Physics = lazy(() => import('../lessons/Physics'))
const HauntedHouse = lazy(() => import('../lessons/HauntedHouse'))
const Particles = lazy(() => import('../lessons/Particles'))
const GalaxyGenerator = lazy(() => import('../lessons/GalaxyGenerator'))
const RayCaster = lazy(() => import('../lessons/RayCaster'))

export default function MyRoutes() {

  return (
    <Routes>

      {/* 🤓 SCENES */}
      <Route path='/Materials' element={ <Materials /> }>  </Route>
      <Route path='/Text' element={ <Text /> }>  </Route>
      <Route path='/Lights' element={ <Lights /> }>  </Route>
      <Route path='/BakingShadows' element={ <BakingShadows /> }>  </Route>

      <Route path='/HauntedHouse' element={ <HauntedHouse /> }> </Route>
      <Route path='/Particles' element={ <Particles /> }> </Route>

      {/* 🌟 GalaxyGenerator has a functional react-dat-gui panel */}
      <Route path='/GalaxyGenerator' element={ <GalaxyGenerator /> }> </Route>
      <Route path='/RayCaster' element={ <RayCaster /> }> </Route>

      {/* ➗ Physics with Leva GUI and 🔉 collision sounds 
         比较吃计算资源 
      */}
      <Route path='/Physics' element={ <Physics /> }> </Route>

      {/* 🖌️ Models & custom burger exported from Blender */}
      <Route path='/ImportedModels' element={ <ImportedModels /> }>  </Route>
      <Route path='/RealisticRendering' element={ <RealisticRendering /> }> </Route>

      {/* 🤯 SHADERS */}
      <Route path='/Shaders' element={ <Shaders /> }>  </Route>
      <Route path='/ShaderPatterns' element={ <ShaderPatterns /> }>  </Route>
      <Route path='/RagingSea' element={ <RagingSea /> }>  </Route>
      <Route path='/AnimatedGalaxy' element={ <AnimatedGalaxy /> }>  </Route>
      <Route path='/ModifiedMaterials' element={ <ModifiedMaterials /> }>  </Route>  {/* 利用 shader 自定义材质 */}

      {/* 😎 EFFECTS - 后处理 */}
      <Route path='/PostProcessing' element={ <PostProcessing /> }>  </Route>

      {/* 💪 TIPS */}
      <Route path='/PerformanceTips' element={ <PerformanceTips /> }>  </Route>

      {/* ⏲️ CANVAS LOADER */}
      <Route path='/CanvasLoader' element={ <CanvasLoader /> }>  </Route>

      {/* WITH HTML
          Label 的淡入淡出
      */}
      <Route path='/HtmlWithWebGL' element={ <HtmlWithWebGL /> }>  </Route>

    </Routes>
  )
};