import React, { useEffect, useRef, useState } from 'react';
// import { useFrame } from '@react-three/fiber';
// import { extend } from '@react-three/fiber'
import * as THREE from 'three';
import { TextureLoader } from 'three';
// import { DragControls } from 'three/addons/controls/DragControls.js';
import {OrbitControls} from '@react-three/drei';
import { useLoader } from "@react-three/fiber";

export const Tile = ({imgUrl, size=10, radius=1}) => {
    const [texture, setTexture] = useState(null);
    const mesh = useRef();
    const [position, setPosition] = useState([0, 0, 0]);
    const srfcOverlay = useLoader(THREE.TextureLoader, imgUrl);
    //loading img texture
    useEffect(() => {
        const loadTexture = () => {
            const loader = new TextureLoader();
            loader.load(imgUrl, (loadedTexture) => {
                if (mesh.current) {
                    setTexture(loadedTexture);
                }
            });
        };

        //Trigger texture load
        if (imgUrl && !texture) {
            loadTexture();
        }

    //"Clean up" texture on unmount
        return () => {
            if (texture) {
                texture.dispose();
            }
        };
    }, [imgUrl, texture]);
    return (
        <>
            <OrbitControls />
            <mesh ref={mesh} position={position}>
                <boxGeometry attach="geometry" args={[size, size, Math.floor(size/2)]} />
                <meshBasicMaterial attach="material" map={srfcOverlay} />
            </mesh>
        </>
    );
}

// extend({DragControls});

// const Tile = ({imgUrl, size = 1, radius = 0.1}) => {
//     const [texture, setTexture] = useState(null);
//     const mesh = useRef();
//     const [position, setPosition] = useState([0, 0, 0]);

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
    //     return () => {
    //         if (texture) {
    //             texture.dispose();
    //         }
    //     };
    // }, [imgUrl, texture]);

    //Animate tile
    // useFrame(() => {
    //     if (mesh.current) {

    //     }
    // });

//     const handleDrag = (event) => {
//         const [x, y, z] = event.object.position.toArray();
//         setPosition([x, y, z]);
//     }

//     return (
//         <mesh ref={mesh} position={position}>
//         <boxBufferGeometry attach="geometry" args={[size, size, size]} />
//         <meshStandardMaterial attach="material" map={texture} />
//         <roundedBoxBufferGeometry
//             args={[size, size, size, radius, 0, radius, 0, 0]}
//         />
//         <dragControls
//             args={[mesh.current]}
//             onDrag={handleDrag}
//         />
//         </mesh>
//     );
// };

// export default Tile;