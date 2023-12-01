import React, { useState, useRef, useEffect } from 'react';
import { MeshStandardMaterial,Mesh,BoxGeometry, 
    EdgesGeometry, LineSegments, LineBasicMaterial, MathUtils } from "three";
import * as THREE from 'three';
import { useLoader, useFrame, Canvas, extend, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { shaderMaterial, Plane, useTexture, Decal } from '@react-three/drei';
// import {OrbitControls} from '@react-three/drei';
// import {useDrag} from '@react-three/drei';

export const Tile = (props) => {
    // const [texture, setTexture] = useState(null);
    // const [hovered, setHover] = useState(false);
    // const cubeRef = useRef();
    // const [isDragging, setDragging] = useState(false);
    const tileRef = useRef();
    useFrame(() => {
        if (tileRef.current) {
            tileRef.current.rotation.x += 0.01;
            tileRef.current.rotation.y += 0.01;
        }
    })
    const lightTanColor = 0xe4d2ba;
    const darkBrownColor = 0x5c4033;
    const prePicTestColor = 0xff0000;

    //  tan sides
    const tileGeometry = new BoxGeometry(props.size, props.size/3.0, props.size);
    const tileMaterial = new MeshStandardMaterial({ color: lightTanColor });
    // const tileMesh = new Mesh(tileGeometry, tileMaterial);

    //edges:
    const edgesGeometry = new EdgesGeometry(tileGeometry);
    const edgesMaterial = new LineBasicMaterial({ color: darkBrownColor });
    const edges = new LineSegments(edgesGeometry, edgesMaterial);

    //picture side
    // const picTexture = useTexture(props.imgUrl);
    // const picGeometry = new BoxGeometry(tileGeometry);
    // const picMaterial = new MeshStandardMaterial({color: prePicTestColor});
    // const picMesh = new Mesh(picGeometry, picMaterial);
    const picTexture = new THREE.TextureLoader().load(props.imgUrl);
    var create = [
        new THREE.Vector2(0, (props.size)/3),
        new THREE.Vector2((props.size)/2, (props.size)/3),
        new THREE.Vector2((props.size)/2, (props.size)/(3/2)),
        new THREE.Vector2(0, (props.size)/3)
    ];
  // Create materials for different faces of the box
    const materialArray = [
      new MeshStandardMaterial({ color: lightTanColor }), // Tan color for other faces
      new MeshStandardMaterial({ color: lightTanColor }), // Tan color for other faces
      new MeshStandardMaterial({ color: lightTanColor }), // Tan color for other faces
      new MeshStandardMaterial({ color: lightTanColor }), // Tan color for other faces
      new MeshStandardMaterial({ map: picTexture }), // Material with texture for the desired face
      new MeshStandardMaterial({ color: lightTanColor }), // Tan color for other faces
    ];
      // Create a material that uses the array of materials
    const boxMaterial = new MeshStandardMaterial({ color: 0xffffff, vertexColors: true });
    tileMaterial.side = 2; // Three.FrontSide

    console.log(tileGeometry);

    // tileGeometry.faces.forEach((face, i) => {
    //     face.materialIndex = i === 4 ? 4 : i % 4; // Set material index based on face (use texture for face at index 4)
    // });

    // Create mesh with box geometry and the material that uses the array of materials
    //const boxMesh = new Mesh(boxGeometry, materialArray);
    const tileMesh = new Mesh(tileGeometry, [tileMaterial, ...materialArray]);

    return (
        <>
            <mesh ref={tileRef} >
                <primitive object={tileMesh}/>
                <primitive object={edges}/>
                {/* <Decal debug scale={[0.5, 0.5, 0.5]}>
                    <meshBasicMaterial map={picTexture}/>
                </Decal> */}
                {/* <DecalGeometry /> */}
            </mesh>
        </>
    );
}