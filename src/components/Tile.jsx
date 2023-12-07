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

export const Tile = (props) => {
    const tileRef = useRef();
    const { camera, raycaster } = useThree();
    const { size, viewport } = useThree();
    const [pos, setPos] = useState([0, 0, 0]);
    const aspect = size.width / viewport.width;
    const [dragging, setDragging] = useState(false);
    const [mouseOffset, setMouseOffset] = useState({ x: 0, z: 0 });

    const lightTanColor = 0xe4d2ba;
    const darkBrownColor = 0x5c4033;

    const [{x, y, z}, api] = useSpring(() => ({
        x: pos[0],
        y: pos[1],
        z: pos[2],
        config: { friction: 5 }
    }));
    //v5 end
    const bind = useDrag(
        ({ down, movement: [mx, mz] }) => {
            const sensitivity = 0.01;
            const liftHeight = down ? 1 : 0;
            const horizonAngle = 30 * (Math.PI/180); //change 30 if different angle of 
                                                            //approach to vanishing point is desired

            console.log("x pos: ", x.get());
            console.log("y pos: ", y.get());
            console.log("z pos: ", z.get());

            const newX = x.get() + mx * sensitivity*0.1;
            // const newY = y.get() + my * sensitivity;
            const newZ = z.get() + mz * sensitivity * horizonAngle; //<-changed from mz to my
            console.log("mx: ", mx, "\n");
            console.log("my: ", mz, "\n");

            const maxX = 5;
            const maxZ = 10;

            const clampedX = Math.max(-maxX, Math.min(maxX, newX));
            const clampedZ = Math.min(0, Math.max(-maxZ, newZ));
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

    //  tan sides
    const tileGeometry = new BoxGeometry(props.size, props.size/3.0, props.size);

    //edges:
    const edgesGeometry = new EdgesGeometry(tileGeometry);
    const edgesMaterial = new LineBasicMaterial({ color: darkBrownColor });
    const edges = new LineSegments(edgesGeometry, edgesMaterial);

    const picPreLoad = new THREE.TextureLoader();
    picPreLoad.crossOrigin = ""; //<--may have helped with pic not loading
    const picTexture = picPreLoad.load(props.imgUrl, undefined, undefined, (loader) => {
        loader.precision = 8;
    });
    // picTexture.anisotropy = THREE.renderer.capabilities.getMaxAnisotropy();
    picTexture.minFilter = THREE.LinearFilter;
    picTexture.magFilter = THREE.LinearFilter;
    picTexture.wrapS = THREE.RepeatWrapping;
    picTexture.wrapT = THREE.RepeatWrapping;
    // picTexture.rotation = Math.PI / 2;

  // Create materials for different faces of the box
    var materialArray = [];
    for (var i=0; i < 6; i++) {
        var toPush;
        if (i === 2) {
            toPush = new MeshStandardMaterial({map: picTexture});
            toPush.alphaTest = 0.5; // You may need to adjust this threshold based on your image
            // toPush.transparent = true;
            toPush.color = new THREE.Color(1, 1, 1); // White color for the background
            // const darkeningFactor = 0.7;
            // toPush.color = new THREE.Color(darkeningFactor, darkeningFactor, darkeningFactor);
        } else {
            toPush = new MeshStandardMaterial({color: lightTanColor});
        }    
        materialArray.push(toPush);
    }

    console.log(tileGeometry);

    const tileMesh = new Mesh(tileGeometry, materialArray);

    useEffect(() => {
    // Set initial rotation values when component is mounted
        tileRef.current.rotation.x = Math.PI / 6; // Tilt to the right
    }, []);

    return (
        <>
            <animated.mesh 
                {...bind()}
                ref={tileRef}
                castShadow
            >
                <primitive object={tileMesh}/>
                <primitive object={edges}/>
                <axesHelper args={[5]} />
            </animated.mesh>
        </>
    );
}