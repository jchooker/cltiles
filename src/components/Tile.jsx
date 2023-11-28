import React, { useEffect, useRef, useState } from 'react';
// import { useFrame } from '@react-three/fiber';
// import { extend } from '@react-three/fiber'
import {MeshStandardMaterial,Mesh,BoxGeometry,MeshBasicMaterial,TextureLoader} from "three";
// import { TextureLoader } from 'three';
// import { DragControls } from 'three/addons/controls/DragControls.js';
// import {OrbitControls} from '@react-three/drei';
import { useLoader } from "@react-three/fiber";

export const Tile = ({imgUrl, size=5, radius=1}) => {
    const [texture, setTexture] = useState(null);
    const cubeRef = useRef();
    const [position, setPosition] = useState([0, 0, 0]);
    // const srfcOverlay = useLoader(THREE.TextureLoader, imgUrl);
    const cubeGeometry = new BoxGeometry(size, size, size);
    const cubeMaterial = new MeshStandardMaterial({color: 0x00ff00});
    const cubeMesh = new Mesh(cubeGeometry, cubeMaterial);

    useEffect(() => {
        const textureLoader = new TextureLoader();
        setTexture(textureLoader.load(imgUrl));
    }, [imgUrl]);

    const cubeTopMaterial = new MeshBasicMaterial({map: texture});

    cubeMesh.material = [
        new MeshStandardMaterial({ color: 0x00ff00 }), // Material for other faces
        new MeshStandardMaterial({ color: 0x00ff00 }), // Material for other faces
        cubeTopMaterial, // Material for the face where you want to overlay the image
        new MeshStandardMaterial({ color: 0x00ff00 }), // Material for other faces
        new MeshStandardMaterial({ color: 0x00ff00 }), // Material for other faces
        new MeshStandardMaterial({ color: 0x00ff00 }),
    ];
    //loading img texture
    // useEffect(() => {
    //     const loadTexture = () => {
    //         const loader = new TextureLoader();
    //         loader.load(imgUrl, (loadedTexture) => {
    //             if (mesh.current) {
    //                 setTexture(loadedTexture);
    //             }
    //         });
    //     };

    //Trigger texture load
        // if (imgUrl && !texture) {
        //     loadTexture();
        // }

    //"Clean up" texture on unmount
    // return () => {
    //     if (texture) {
    //         texture.dispose();
    //     }
    // };
    // }, [imgUrl, texture]);
    // const loadTexture = () => {
    //     const loader = new TextureLoader();
    //     loader.load(imgUrl, (loadedTexture) => {
    //         if (mesh.current) {
    //             setTexture(loadedTexture);
    //         }
    //     });
    // };

  //Trigger texture load
    // if (imgUrl && !texture) {
    //     loadTexture();
    // }

  //"Clean up" texture on unmount
  // return () => {
  //     if (texture) {
  //         texture.dispose();
  //     }
  // };
    return (
        <>
            <mesh ref={cubeRef} position={position}>
                <boxGeometry
                    attach="geometry"
                    args={[size, size, size]}
                />
                <meshStandardMaterial color={0x00ff00} />
            </mesh>
        </>
    );
}