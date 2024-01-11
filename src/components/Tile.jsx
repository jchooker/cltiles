import React, { useState, useRef, useEffect } from 'react';
import { MeshStandardMaterial,Mesh,BoxGeometry, 
    EdgesGeometry, LineSegments, LineBasicMaterial, MathUtils, Shape, ShapeGeometry } from "three";
import * as THREE from 'three';
import { useThree, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { shaderMaterial, Plane, useTexture, Decal } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import { useDrag, useGesture } from "@use-gesture/react";
import { animated, useSpring } from '@react-spring/three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const Tile = (props) => {
    const tileRef = useRef();
    const { camera, raycaster } = useThree();
    const { size, viewport } = useThree();
    const [pos, setPos] = useState([0, 0, 0]);
    const aspect = size.width / viewport.width;
    const [dragging, setDragging] = useState(false);
    const [mouseOffset, setMouseOffset] = useState({ x: 0, z: 0 });
    const gltf = useLoader(GLTFLoader, '/src/assets/tilemodels/tile1.glb');

    const lightTanColor = 0xe4d2ba;
    const darkBrownColor = 0x5c4033;

    const a = new THREE.Vector3(0, 1, 0);

    const [{x, y, z}, api] = useSpring(() => ({
        x: pos[0],
        y: pos[1],
        z: pos[2],
        config: { friction: 5 }
    }));
    //v5 end
    const bind = useDrag(
        ({ down, movement: [mx, mz] }) => {
            const sensitivity = 0.001;
            const liftHeight = down ? 1 : 0;
            const horizonAngle = 30 * (Math.PI/180); //change 30 if different angle of 
                                                            //approach to vanishing point is desired

            console.log("x pos: ", x.get());
            console.log("y pos: ", y.get());
            console.log("z pos: ", z.get());

            const newX = x.get() - mx * sensitivity;
            // const newY = y.get() + my * sensitivity;
            const newZ = z.get() - mz * sensitivity; //<-changed from mz to my
            console.log("mx: ", mx, "\n");
            console.log("my: ", mz, "\n");

            const maxX = 8;
            const maxZ = 8;

            const clampedX = Math.max(-maxX, Math.min(maxX, newX));
            const clampedZ = Math.max(0, Math.min(maxZ, newZ));
            console.log(clampedX);
            console.log(clampedZ);
            // setDragging(true);
            api.start({
                x: clampedX, 
                // y: newY,
                z: clampedZ,
                immediate: true
            });
            setPos([clampedX, liftHeight, clampedZ]);

            if (tileRef.current) {
                tileRef.current.position.x = clampedX;
                tileRef.current.position.y = liftHeight;
                tileRef.current.position.z = clampedZ;
            }
        },
        {pointerEvents: true}
        //v5 end
    );

    return (
        <>
                <primitive object={gltf.scene} />
                <gridHelper args={[12, 12]} />
                <axesHelper args={[5]} />
            {/* </animated.mesh> */}
        </>
    );
}