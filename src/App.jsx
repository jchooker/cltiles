import React, { Suspense, useEffect, useState, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
// import { BrowserRouter, Routes } from 'react-router-dom';
import { useLoader, useThree } from '@react-three/fiber';
import {Canvas} from '@react-three/fiber';
import {Tile} from './components/Tile';
import {CustomPlane} from './components/Plane';
import {Plane} from '@react-three/drei';
import './App.css';
// import { OrbitControls } from '@react-three/drei';

  function calculatePosition(vanishingPoint, offset) {
    const direction = new THREE.Vector3(0, 0, -1);
    const distance = Math.sqrt(
      Math.pow(vanishingPoint.x, 2) + Math.pow(vanishingPoint.y, 2)
    );
    const finalPosition = new THREE.Vector3(
      vanishingPoint.x - offset * direction.x * distance,
      vanishingPoint.y - offset * direction.y * distance,
      0
    );
    return finalPosition;
  };

function App() {
  // const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const imgUrl = "./src/assets/serp.png";
  // const setCamState = useThree(({camera}) => {
  //   camera.rotation.set(THREE.MathUtils.degToRad(30), 0, 0);
  // });
  // useEffect(() => {
  //   set({camera: (THREE.MathUtils.degToRad(30),0,0)})
  // })
  const [planeVanishingPoint, setPlaneVanishingPoint] = useState({x:0, y:0, z:10});
  const [initialized, setInitialized] = useState(false);
  const [position, setPosition] = useState(() => calculatePosition(planeVanishingPoint, 0.5));
  const newPosition = useRef(position);
  
  useEffect(() => {
    // newPosition.current = calculatePosition(planeVanishingPoint, 0.5);
    // if (newPosition.current) newPosition.current();
    setPosition(calculatePosition(planeVanishingPoint, 0.5));
  }, [planeVanishingPoint]);

  function testElem() {
    console.log("*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~TEST PLANE POS: ", newPosition.current);
  }

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 50, near: 0.1, far: 1000}}
        // camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 1000, rotation: (THREE.MathUtils.degToRad(30), 0, 0) }}
        // onCreated={{ setCamState }}
      >
        <plane args={[1, 1]}
        />
          <meshStandardMaterial color={"orange"} wireframe={false} side={THREE.DoubleSide}/>
        {/* <OrbitControls></OrbitControls> */}
        <Tile imgUrl={imgUrl} size={3.0}></Tile>
        <ambientLight intensity={5} />
        {/* <directionalLight position={[0,10,10]} /> */}
      </Canvas>
    </>
  );
}

export default App

