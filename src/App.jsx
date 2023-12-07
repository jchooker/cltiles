import React, { Suspense } from 'react';
import * as THREE from 'three';
// import { BrowserRouter, Routes } from 'react-router-dom';
import { Canvas, useLoader } from '@react-three/fiber';
import {Tile} from './components/Tile';
import {CustomPlane} from './components/Plane';
import './App.css';
// import { OrbitControls } from '@react-three/drei';

function App() {
  // const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const imgUrl = "./src/assets/serp.png";
  return (
    <>    
      <Canvas camera={{position: [0, 0, 10], fov: 50, near: 0.1, far: 1000}}>
        <CustomPlane></CustomPlane>

        {/* <OrbitControls></OrbitControls> */}
        <Tile imgUrl={imgUrl} size={3.0}></Tile>
        <ambientLight intensity={5} />
        {/* <directionalLight position={[0,10,10]} /> */}

      </Canvas>
    </>
  );
}

export default App

