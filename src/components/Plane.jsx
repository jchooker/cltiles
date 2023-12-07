import React, { useState, useRef, useEffect } from 'react';
import { MeshStandardMaterial,Mesh,BoxGeometry, 
    EdgesGeometry, LineSegments, LineBasicMaterial, MathUtils } from "three";
import * as THREE from 'three';
import { useLoader, useFrame, Canvas, extend, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { shaderMaterial, Plane, useTexture, Decal } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import { useDrag, useGesture } from "@use-gesture/react";
import { animated, useSpring } from '@react-spring/three';

export const CustomPlane = () => {
    const planeRef = useRef();

    return (
        <mesh ref={planeRef}>
            <planeGeometry args={[10, 10]} />
            <meshBasicMaterial color={0xcccccc} transparent opacity={0.5} />
        </mesh>
    );
};