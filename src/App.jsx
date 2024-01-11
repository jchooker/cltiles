import React, { Suspense, useEffect, useState, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
// import { BrowserRouter, Routes } from 'react-router-dom';
import { useLoader, useThree } from '@react-three/fiber';
import {Canvas} from '@react-three/fiber';
import {Tile} from './components/Tile';
import {CustomPlane} from './components/Plane';
import {Plane, OrbitControls, OrthographicCamera} from '@react-three/drei';
import './App.css';
// import { OrbitControls } from '@react-three/drei';

  function calculatePosition(vanishingPoint, offset) {
    const direction = new THREE.Vector3(0, 0, 0);
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
  const imgUrl = "../src/assets/serp.png";
  const [planeVanishingPoint, setPlaneVanishingPoint] = useState({x:0, y:5, z:-5});
  const [initialized, setInitialized] = useState(false);
  const [position, setPosition] = useState(()=>calculatePosition(planeVanishingPoint, 0.5));
  //v1 begin
  // const [position, setPosition] = useState(() => calculatePosition(planeVanishingPoint, 0.5));
  //v1 end
  const newPosition = useRef(position);
  const direction = new THREE.Vector3(0, -1, -1);
  const rotationAngle = Math.atan2(planeVanishingPoint.x, planeVanishingPoint.z);
  
  useEffect(() => {
    newPosition.current.y = Math.abs(newPosition.current.y) * -1;
    // newPosition.current.y = 50;
    newPosition.current.x = calculatePosition(planeVanishingPoint, 0.5).x;
    newPosition.current.z = calculatePosition(planeVanishingPoint, 0.5).z; 
    setPosition(calculatePosition(planeVanishingPoint, 0.5));
    testElem();
  }, [planeVanishingPoint]);

  function testElem() {
    console.log("*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~TEST PLANE POS: ", newPosition.current);
  }

  return (
    <>
      <Canvas
        // camera={{ position: [0, 0, 50], fov: 40, near: 0.01, far: 1000, rotation: [0.3, 0, 0]}}
        camera={{
          position: [0, 10, -8],
          fov: 50,
          aspect: window.innerWidth / window.innerHeight,
          near: 1,
          far: 1000,
          rotation: (0, 0, 0),
        }}
        // onCreated={{ setCamState }}
      >
        <plane args={[1, 1]} />
        <meshStandardMaterial
          color={"orange"}
          wireframe={false}
          side={THREE.DoubleSide}
        />
        {/* <OrbitControls></OrbitControls> */}
        <Tile
          imgUrl={imgUrl}
          size={3.0}
          position={newPosition.current}
          rotation={[0, 0, 0]}
        ></Tile>
        <ambientLight intensity={5} />
        {/* <directionalLight position={[0,10,10]} /> */}
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App

