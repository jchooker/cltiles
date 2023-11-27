import React from 'react';
import * as THREE from 'three';
// import { BrowserRouter, Routes } from 'react-router-dom';
import { Canvas, useLoader } from '@react-three/fiber';
import {Tile} from './components/Tile';

function App() {
  const imgUrl = "https://i.ibb.co/vV6CJM4/asmodeus.png";
  return (
      <Canvas>
        <ambientLight />
        {/* <Tile imgUrl={imgUrl} size={2} radius={0.1}></Tile> */}
        <Tile imgUrl={imgUrl}></Tile>
      </Canvas>
  )
}

export default App

