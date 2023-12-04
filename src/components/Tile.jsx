import React, { useState, useRef, useEffect } from 'react';
import { MeshStandardMaterial,Mesh,BoxGeometry, 
    EdgesGeometry, LineSegments, LineBasicMaterial, MathUtils } from "three";
import * as THREE from 'three';
import { useLoader, useFrame, Canvas, extend, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { shaderMaterial, Plane, useTexture, Decal } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
// import {useDrag} from '@react-three/drei';
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from '@react-spring/three';

export const Tile = (props) => {
    // const [texture, setTexture] = useState(null);
    // const [hovered, setHover] = useState(false);
    // const cubeRef = useRef();
    // const [isDragging, setDragging] = useState(false);
    const tileRef = useRef();
    const { camera } = useThree();
    const { size, viewport } = useThree();
    const [pos, setPos] = useState([0, 1, 0]);
    const aspect = size.width / viewport.width;
    const [dragging, setDragging] = useState(false);
    const [mouseOffset, setMouseOffset] = useState({ x: 0, z: 0 });

    let planeIntersectPoint = new THREE.Vector3();
    // useFrame(() => {
    //     if (tileRef.current) {
    //         tileRef.current.rotation.x += 0.01;
    //         tileRef.current.rotation.y += 0.01;
    //     }
    // })
    const lightTanColor = 0xe4d2ba;
    const darkBrownColor = 0x5c4033;
    //V1-2 SPRING START
    // const [spring, api] = useSpring(() => ({
    //     // position: [0, 0, 0],
    //     position: pos,
    //     scale: 1,
    //     rotation: [0, 0, 0],
    //     config: { friction: 100 }
    // }));
    //V1-2 SPRING END
    const [{x, y}, api] = useSpring(() => ({ x: 0, y: 0}));
    const bind = useDrag(
        // ({ active, movement: [x, y], timeStamp, event }) => {
        //     if (active) {
        //         event.ray.intersectPlane(props.floorPlane, planeIntersectPoint);
        //         setPos([planeIntersectPoint.x, 1.5, planeIntersectPoint.z]);
        //     }

        //     // setIsDragging(active);

        //     api.start({
        //         // position: active ? [x / aspect, -y / aspect, 0] : [0, 0, 0],
        //         position: pos,
        //         scale: active ? 1.2 : 1,
        //         rotation: [y / aspect, x / aspect, 0]
        //     });
        //     return timeStamp;
        // },
        // { delay: true }
        //START V1
        // ({ offset: [x, z]}) => {
        //     const [, y,] = pos;
        //     setPos([x / aspect, 2*(y / aspect), 2*(z / aspect)]);
        // },
        // { pointerEvents: true }
        //END V1
        //START V2
        // ({ offset: [x, y], last, vxvy: [vx, vy] }) => {
        //     const [, scaleY,] = tileRef.current.scale.toArray();
        //     //calc new scale along y-axis based on vert drag
        //     const newScaleY = Math.max(0.3, Math.min(1, scaleY - vy / aspect));
        //     //update scale along y-axis
        //     tileRef.current.scale.setY(newScaleY);
        //     //calc new pos based on horizontal drag
        //     tileRef.current.position.x -= vx / aspect;
        //     //optional - update position along z axis
        //     const minZ = -5;
        //     const maxZ = 5;
        //     tileRef.current.position.z = Math.max(minZ, Math.min(maxZ, tileRef.current.position.z));
        //     //update rotation based on horizontal drag
        //     tileRef.current.rotation.y += vx / aspect * 0.005;
        // }
        //END V2
        //V3
        ({movement: [deltaX, deltaY], last}) => {
            const newY = y.get() + deltaY / 100;
            const newX = x.get() + deltaX / 100;

            api.start({ x: newX, y: newY });
        }
        //END V3
    );

    const handleMouseDown = (event) => {
        setDragging(true);
        const { clientX, clientZ } = event;
        const { x, z } = tileRef.current.position;
        setMouseOffset({ x: clientX - x, z: clientZ - z });
    };

    const handleMouseMove = (event) => {
        if (!dragging) return;
        const { clientX, clientZ } = event;
        const newX = clientX - mouseOffset.x;
        const newZ = clientZ - mouseOffset.z;
        
        // Set constraints for x and z
        const minX = -5; // Adjust as needed
        const maxX = 5; // Adjust as needed
        const minZ = -5; // Adjust as needed
        const maxZ = 5; // Adjust as needed

        tileRef.current.position.x = Math.max(minX, Math.min(maxX, newX));
        tileRef.current.position.z = Math.max(minZ, Math.min(maxZ, newZ));
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    //  tan sides
    const tileGeometry = new BoxGeometry(props.size, props.size/3.0, props.size);
    // const piece = tileGeometry.toNonIndexed();
    // const tileMaterial = new MeshStandardMaterial({ color: lightTanColor });
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
    const picPreLoad = new THREE.TextureLoader();
    picPreLoad.crossOrigin = "";
    const picTexture = picPreLoad.load(props.imgUrl, undefined, undefined, (loader) => {
        loader.precision = 8;
    });
    // picTexture.anisotropy = THREE.renderer.capabilities.getMaxAnisotropy();
    picTexture.minFilter = THREE.LinearFilter;
    picTexture.magFilter = THREE.LinearFilter;
    picTexture.wrapS = THREE.RepeatWrapping;
    picTexture.wrapT = THREE.RepeatWrapping;
    picTexture.rotation = Math.PI / 2;
    // var create = [
    //     new THREE.Vector2(0.0, (props.size)/3.0),
    //     new THREE.Vector2((props.size)/2.0, (props.size)/3.0),
    //     new THREE.Vector2((props.size)/2.0, (props.size)/(3.0/2.0)),
    //     new THREE.Vector2(0, (props.size)/3.0)
    // ];
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
      // Create a material that uses the array of materials
    // const boxMaterial = new MeshStandardMaterial({ color: 0xffffff, vertexColors: true });
    // tileMaterial.side = 2; // Three.FrontSide

    console.log(tileGeometry);

    // tileGeometry.faces.forEach((face, i) => {
    //     face.materialIndex = i === 4 ? 4 : i % 4; // Set material index based on face (use texture for face at index 4)
    // });

    // Create mesh with box geometry and the material that uses the array of materials
    //const boxMesh = new Mesh(boxGeometry, materialArray);
    const tileMesh = new Mesh(tileGeometry, materialArray);

    useEffect(() => {
    // Set initial rotation values when component is mounted
        tileRef.current.rotation.x = Math.PI / 6; // Tilt to the right
    }, []);

    return (
        <>
            <animated.mesh 
                //v1-2 spring + bind
                // {...spring} {...bind()}
                //v1-2 spring + bind end
                //v3 start
                {...bind()}
                //v3 end
                position={pos}
                ref={tileRef} 
                // onDragStart={handleMouseDown}
                // onDrag={handleMouseMove}
                // onDragEnd={handleMouseUp}
                castShadow
            >
                <primitive object={tileMesh}/>
                <primitive object={edges}/>
            </animated.mesh>
        </>
    );
}