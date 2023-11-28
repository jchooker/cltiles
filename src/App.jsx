import React from 'react';
import * as THREE from 'three';
// import { BrowserRouter, Routes } from 'react-router-dom';
import { Canvas, useLoader } from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import {Tile} from './components/Tile';

function App() {
  const imgUrl = "https://i.ibb.co/vV6CJM4/asmodeus.png";
  return (
    <Canvas camera={{position: [0, 0, 10], fov: 50, near: 0.1, far: 1000}}>
      {/* <ambientLight /> */}
      {/* <Tile imgUrl={imgUrl} size={2} radius={0.1}></Tile> */}
      <OrbitControls></OrbitControls>
      <Tile imgUrl={imgUrl}></Tile>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
    </Canvas>
  );
}

export default App

