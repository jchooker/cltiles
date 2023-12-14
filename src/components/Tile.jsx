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

    // const roundedRectShape = new Shape();
    // const radius = props.size / 10;
    // const x1 = props.size/2;
    // const y1 = props.size/6;
    //see roundedRectShape
    // roundedRectShape.moveTo( x1, y1 )
    //     .quadraticCurveTo( x1 + 50, y1 - 80, x1 + 90, y1 - 10 )
    //     .quadraticCurveTo( x1 + 100, y1 - 10, x1 + 115, y1 - 40 )
    //     .quadraticCurveTo( x1 + 115, y1, x1 + 115, y1 + 40 )
    //     .quadraticCurveTo( x1 + 100, y1 + 10, x1 + 90, y1 + 10 )
    //     .quadraticCurveTo( x1 + 50, y1 + 80, x1, y1 );
    // roundedRectShape.moveTo(-props.size / 2, props.size / 6);
    // roundedRectShape.arc(-props.size / 6, props.size / 6, radius, 0, Math.PI / 2);
    // roundedRectShape.lineTo(props.size / 6, props.size / 2);
    // roundedRectShape.arc(props.size / 6, props.size / 6, radius, Math.PI / 2, Math.PI);
    // roundedRectShape.lineTo(-props.size / 2, props.size / 6);

        
    // Create geometry for the top face using the rounded shape
    // const topGeometry = new ShapeGeometry(roundedRectShape);

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

    //  tan sides
    // const tileGeometry = new BoxGeometry(props.size, props.size/3.0, props.size);

    //edges:
    // const edgesGeometry = new EdgesGeometry(tileGeometry);
    // const edgesMaterial = new LineBasicMaterial({ color: darkBrownColor });
    // const edges = new LineSegments(edgesGeometry, edgesMaterial);

    // const picPreLoad = new THREE.TextureLoader();
    // picPreLoad.crossOrigin = ""; //<--may have helped with pic not loading
    // const picTexture = picPreLoad.load(props.imgUrl, undefined, undefined, (loader) => {
    //     loader.precision = 8;
    // });
    // picTexture.anisotropy = THREE.renderer.capabilities.getMaxAnisotropy();
    // picTexture.minFilter = THREE.LinearFilter;
    // picTexture.magFilter = THREE.LinearFilter;
    // picTexture.wrapS = THREE.RepeatWrapping;
    // picTexture.wrapT = THREE.RepeatWrapping;
    // picTexture.rotation = Math.PI / 2;

  // Create materials for different faces of the box
    // var materialArray = [];
    // for (var i=0; i < 6; i++) {
    //     var toPush;
    //     if (i === 2) {
    //         toPush = new MeshStandardMaterial({map: picTexture});
    //         toPush.alphaTest = 0.5; // You may need to adjust this threshold based on your image
    //         // toPush.transparent = true;
    //         toPush.color = new THREE.Color(1, 1, 1); // White color for the background
    //         // const darkeningFactor = 0.7;
    //         // toPush.color = new THREE.Color(darkeningFactor, darkeningFactor, darkeningFactor);
    //     } else {
    //         toPush = new MeshStandardMaterial({color: lightTanColor});
    //     }    
    //     materialArray.push(toPush);
    // }

    // console.log(tileGeometry);

    // const tileMesh = new Mesh(topGeometry, materialArray);

    // useEffect(() => {
    // // Set initial rotation values when component is mounted
    //     tileRef.current.rotation.x = Math.PI / 8; // Tilt to the right
    //     tileRef.current.rotation.y = Math.PI; // Tilt to the right
    // }, []);

    return (
        <>
            {/* <animated.mesh 
                {...bind()}
                ref={tileRef}
                castShadow */}
            {/* > */}
                {/* <primitive object={a} /> */}
                {/* <primitive object={tileMesh}/> */}
                {/* <primitive object={topGeometry} />
                <primitive object={edges}/>
                <meshStandardMaterial attachArray="material" color={lightTanColor} />
                <meshStandardMaterial attachArray="material" color={lightTanColor} />
                <meshStandardMaterial attachArray="material" map={picTexture} />
                <meshStandardMaterial attachArray="material" color={lightTanColor} />
                <meshStandardMaterial attachArray="material" color={lightTanColor} />
                <meshStandardMaterial attachArray="material" color={lightTanColor} /> */}
                <primitive object={gltf.scene} />
                <gridHelper args={[12, 12]} />
                <axesHelper args={[5]} />
            {/* </animated.mesh> */}
        </>
    );
}