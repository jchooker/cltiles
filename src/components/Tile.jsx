import React, { useState, useRef, useEffect } from 'react';
import { MeshStandardMaterial,Mesh,BoxGeometry, 
    EdgesGeometry, LineSegments, LineBasicMaterial, MathUtils } from "three";
import * as THREE from 'three';
import { useLoader, useFrame, Canvas, extend, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { shaderMaterial, Plane, useTexture, Decal } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
// import {useDrag} from '@react-three/drei';
import { useDrag, useGesture } from "@use-gesture/react";
import { animated, useSpring } from '@react-spring/three';

export const Tile = (props) => {
    // const [texture, setTexture] = useState(null);
    // const [hovered, setHover] = useState(false);
    // const cubeRef = useRef();
    // const [isDragging, setDragging] = useState(false);
    const tileRef = useRef();
    const { camera, raycaster } = useThree();
    const { size, viewport } = useThree();
    const [pos, setPos] = useState([0, 1, 0]);
    const aspect = size.width / viewport.width;
    const [dragging, setDragging] = useState(false);
    const [mouseOffset, setMouseOffset] = useState({ x: 0, z: 0 });

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
    //v4 start
    // const [{x, y, z}, api] = useSpring(() => ({ x: 0, y: 0, z: 0 }));
    //v4 end
    //v5 start
    const [{x, z}, api] = useSpring(() => ({
        x: pos[0],
        z: pos[2],
        config: { friction: 20 }
    }));
    //v5 end
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
        // ({movement: [deltaX, deltaY], last}) => {
        //     const newY = y.get() + deltaY / 100;
        //     const newX = x.get() + deltaX / 100;

        //     api.start({ x: newX, y: newY });
        // }
        //END V3
        //start v4
        // ({ down, movement: [mx, my]}) => {
        //     const horizonDeg = 30;
        //     const radAngle = (horizonDeg * Math.PI) / 180;
        //     const planeX = mx * Math.cos(radAngle);
        //     const planeY = my * Math.sin(radAngle);
        //     //mvmt restriction
        //     // const minX = 0;
        //     // const minZ = 0;
        //     const planeMagnitude = Math.sqrt(planeX**2 + planeY**2);
        //     const maxX = 2;
        //     const maxY = 2;
        //     const maxZ = 2;
        //     //Apply restriction
        //     const newX = Math.max(-maxX, Math.min(maxX, planeX));
        //     // const newY = my; //no restrictions on y needed?
        //     const newY = Math.max(-maxY, Math.min(maxY, planeY));
        //     const newZ = Math.max(-maxZ, Math.min(maxZ, planeMagnitude));

        //     api.start({ x: down ? newX : 0, y: down ? newY : 0, immediate: down, z: down ? newZ : 0});

        //     setPos([newX, newY, newZ]);
        //     console.log(newX, newY, newZ);
        // }
        //end v4
        //v5 start
        ({ down, offset: [mx, mz] }) => {
            const y = 1.5;
            const sensitivity = 0.1;

            console.log(x.get());
            console.log(z.get());

            const newX = x.get() + mx * sensitivity;
            const newZ = z.get() - mz * sensitivity;
            // if(down) {
            //     console.log(pos[0], pos[1], pos[2]);
            //     // event.THREE.Ray.intersectPlane(floorPlane, planeIntersectPoint);
            //     raycaster.setFromCamera(
            //         {
            //             x: event.clientX / window.innerWidth,
            //             y: event.clientY / window.innerHeight,
            //         },
            //         camera
            //     );
            //     const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            //     const planeIntersectPoint = new THREE.Vector3();

            //     raycaster.ray.intersectPlane(floorPlane, planeIntersectPoint);
            //     setPos([planeIntersectPoint.x, 1.5, planeIntersectPoint.z]);
            // }
            const maxX = 5;
            const maxZ = 5;

            const clampedX = Math.max(-maxX, Math.min(maxX, newX));
            const clampedZ = Math.max(-maxZ, Math.min(maxZ, newZ));
            console.log(clampedX);
            console.log(clampedZ);
            setDragging(true);
            api.start({
                x: down ? clampedX : 0, 
                z: down ? clampedZ : 0
                // onUpdate: ({x, z}) => {
                //     setPos([x.get(), y, z.get()]);
                //     console.log(pos);
                // setPos([clampedX, y, clampedZ]);
            });
            setPos([clampedX, 1.5, clampedZ]);

            if (tileRef.current) {
                tileRef.current.position.x = clampedX;
                tileRef.current.position.z = clampedZ;
            }
        },
        {pointerEvents: true}
        //v5 end
    );

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
                // {...bind()}
                //v3 end
                //v5 start
                //style={{x, z}}
                {...bind()}
                //v5 end
                //REACTIVATE POSITION??
                // position={pos}
                //REACTIVE POSITION^^??
                ref={tileRef}
                onPointerUp={()=> setDragging(false)} 
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