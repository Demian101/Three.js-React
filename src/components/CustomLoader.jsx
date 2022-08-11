import { Loader, useProgress } from '@react-three/drei';
import { useEffect, useRef } from 'react';

export default function CustomLoader() {
  // Custom Loader Implementation
  const loadingBar = useRef();
  const { active, progress, errors, item, loaded, total } = useProgress();

  useEffect(() => {
    // console.log(loadingBar.current.style);
    // console.log(progress);
    // loadingBar.current.style.width = `${progress}%`
    loadingBar.current.style.transform = `scaleX(${progress / 100})`;
  }, [loadingBar, progress]);

  // Drei Loader Styles
  const container = {
    backgroundColor: 'black',
    fontSize: '24px',
    transition: 'opacity 300ms ease',
    opacity: 1
  };
  const inner = {
    width: '100%', // default is 100px
    background: 'none',
    height: 4 // default is 3
  };
  const bar = {
    width: '100%', // default width
    transformOrigin: 'center center',
    height: 4 // default is 3
  };
  const data = {
    fontFamily: 'Fira Code, mono'
  };
  return (
    <>
      {/* <Loader
        containerStyles={container}
        innerStyles={inner}
        barStyles={bar}
        dataStyles={data}
        // dataInterpolation={(p) => `Still wondering if ${p.toFixed(0)} / ${p.toFixed(0)} = 1 `}
        dataInterpolation={(p) => {
          p = p.toFixed();
          return `Still wondering if ${p} * ${p} = ${p * p} 🤯`;
        }}
        initialState={(active) => {
          // console.log(active);
          // if (!active) {
          //   // without setTimeout, I get cannot update component (`App`) while rendering component (`Loader`)
          //   setTimeout(() => {
          //     setLoaded(true);
          //   }, 100);
          // }
        }}
      /> */}
      <div className="customLoader">
        <div className="loadingBarContainer">
          <div className="loadingBar" ref={loadingBar}></div>
        </div>
        <p>
          {progress.toFixed()} * {-progress.toFixed()} ?={' '}
          {progress.toFixed() * -progress.toFixed()}
        </p>
        <p className="loadingBarItem">{item}</p>
        {/* <p>{loaded} / {total}</p> */}
      </div>
    </>
  );
}

// default Loader styles from Drei
const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#171717',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 300ms ease',
    zIndex: 1000
  },
  inner: {
    width: 100,
    height: 3,
    background: '#272727',
    textAlign: 'center'
  },
  bar: {
    height: 3,
    width: '100%',
    background: 'white',
    transition: 'transform 200ms',
    transformOrigin: 'left center'
  },
  data: {
    display: 'inline-block',
    position: 'relative',
    fontVariantNumeric: 'tabular-nums',
    marginTop: '0.8em',
    color: '#f0f0f0',
    fontSize: '0.6em',
    fontFamily: `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Helvetica Neue", Helvetica, Arial, Roboto, Ubuntu, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    whiteSpace: 'nowrap'
  }
};
