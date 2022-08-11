import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Sidebar.scss';
import gsap from 'gsap';

export default function Sidebar() {
  const sidebar = useRef();
  const sidebarBody = useRef();
  const toggle = useRef();
  const [show, setShow] = useState(true);

  function toggleSidebar() {
    // Hide
    if (show) {
      gsap.to(sidebarBody.current, {
        duration: 0.8,
        x: -260,
        ease: 'power2.inOut'
      });
      gsap.to(toggle.current, {
        duration: 0.8,
        x: -260,
        rotation: -180,
        ease: 'power2.inOut',
        // css: {
        //   transform: 'rotate(Math.PI)'
        // }
      });
      setShow(false)
    }

    // Unhide
    if (!show) {
      gsap.to(sidebarBody.current, {
        duration: 0.8,
        x: 0,
        ease: 'power2.inOut'
      });
      gsap.to(toggle.current, {
        duration: 0.8,
        x: 0,
        rotation: 0,
        ease: 'power2.inOut'
      });
      setShow(true)
    }
  }

  // const 
  // Show on initial mount
  useEffect(() => {
    gsap.to(sidebar.current, {
      duration: 1,
      opacity: 1,
      delay: 1,
    });
  }, [sidebar]);

  const componentsPath = [
    'ImportedModels',
    'Text',
    'Lights',
    'Materials',
    'BakingShadows',
    'HtmlWithWebGL',
    'PerformanceTips',
    'CanvasLoader',
    'PostProcessing',
    'ModifiedMaterials',
    'Shaders',
    'ShaderPatterns',
    'RagingSea',
    'AnimatedGalaxy',
    'RealisticRendering',
    'Physics',
    'HauntedHouse',
    'Particles',
    'GalaxyGenerator',
    'RayCaster',
  ]
  const navigate = useNavigate();

  const onClick = (path) => {
    console.log("path",path)
    navigate(path);
  }

  return (    
    <div className="sidebar" ref={sidebar}>
      {/* TOGGLE */}
      <div className="sidebarToggle" ref={toggle} onClick={toggleSidebar}>
        {/* <p>&larr;</p> */}
        <p>{'<'}</p>
      </div>

      {/* BODY */}
      <div className="sidebarBody" ref={sidebarBody}>
        {/* CONTENT */}
        <div className="sidebarHeader">
          <h3 className="sidebarHeaderText">R3F Journey</h3>
        </div>

        {/* <div>
          {nums.map((item) => {
            return (<button key={item} >  {item} </button>)
          })}
        </div> */}

        {/* 对象插入 React 中的遍历方法 */}
        <div>
          { 
            componentsPath.map(value => {
              return (<button key={value} onClick={(e) => onClick(value)}>  {value} </button>)
            })
          }
        </div>
        
        {/* 
        ).map(wave => (
              <div key={Date.parse(wave.timestamp)} className="waveTableEntry">
                <small>{wave.address}</small>
                <small>{wave.timestamp.toString()}</small>
                <hr style={{ width: '100%' }} />
                {wave.message ? wave.message : '<blank message>'}
              </div> 
        */}

        <div className="sidebarMain"></div>
      </div>
    </div>
  );
}
