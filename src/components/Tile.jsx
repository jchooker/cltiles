import React, { useEffect, useState } from 'react';
import {MeshStandardMaterial,Mesh,BoxGeometry,TextureLoader, 
    EdgesGeometry, LineSegments, LineBasicMaterial, MathUtils} from "three";
// import { TextureLoader } from 'three';
// import { DragControls } from 'three/addons/controls/DragControls.js';
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
// import {OrbitControls} from '@react-three/drei';
// import {useDrag} from '@react-three/drei';

export const Tile = ({imgUrl, size=5, radius=1}) => {
    const [texture, setTexture] = useState(null);
    // const [hovered, setHover] = useState(false);
    // const cubeRef = useRef();
    // const [isDragging, setDragging] = useState(false);
    const lightTanColor = 0xe4d2ba;
    const [{x, y, z}, api] = useSpring(() => ({ x: 0, y: 0, z: 0}));
    const bind = useDrag(
        ({ down, movement: [mx, my, mz], memo=[x.get(), y.get(), z.get()]}) => {
            if (down) {
                api.start({
                    x: mx,
                    y: Math.max(my, 0),
                    z: mz,
                    immediate: down,
                });
            } else {
                api.start({y: 0});
            }
            return memo;
        },
        {pointerEvents: true}
        );

    // const {rayscaster} = useThree();
    // const srfcOverlay = useLoader(THREE.TextureLoader, imgUrl);
    // const cubeGeometry = new BoxGeometry(size, size, size);
    // const cubeMaterial = new MeshStandardMaterial({color: 0x00ff00});
    // const cubeMesh = new Mesh(cubeGeometry, cubeMaterial);

    useEffect(() => {
        const textureLoader = new TextureLoader();
        setTexture(textureLoader.load(imgUrl));
    }, [imgUrl]);

    // const {bind} = useDrag({
    //     movement: [x, y]}) => {
    //         tileMesh.position.x = x;
    //         tileMesh.position.y = y;
    //     },
    //     {PointerEvent: hovered});
    const tileGeometry = new BoxGeometry(size, Math.floor(size/2), size);
    const tileMaterial = new MeshStandardMaterial({ color: lightTanColor });
    
    const tileMesh = new Mesh(tileGeometry, tileMaterial);

    const edgeMaterial = new MeshStandardMaterial({ color: lightTanColor });

    const edges = new EdgesGeometry(tileGeometry);
    const verts = new LineSegments(
        edges,
        new LineBasicMaterial({ color: 0x5c4033 })
    );
    tileMesh.add(verts);

    //drag tools
    // const ref = useRef();

    // const [{x, y, z}, api] = useSpring(() => ({x: 0, y: 0, z: 0}))

    // const bind = useDrag(({down, movement: [mx, mz]}) => {
    //     api.start({x: down ? mx: 0, z: down ? mz : 0, immediate: down})
    // });

    // useFrame((state, delta) => {
    //     ref.current.position.x
    // })
    // const controls = new DragControls(objects, camera, renderer.domElement);
    // controls.addEventListener('dragstart', (event) => {
    //     event.object.material.emissive.set(0xaaaaaa);
    // });

    // const cubeTopMaterial = new MeshBasicMaterial({map: texture});

    const bottomMaterial = new MeshStandardMaterial({ color: lightTanColor });

    tileMesh.material = [tileMaterial, edgeMaterial, bottomMaterial]

    const inclination = MathUtils.degToRad(25);
    tileMesh.rotation.x = inclination;

      // useThreeSpring hook to handle animations in three.js
    // const tileSpring = useThreeSpring({
    //     position: [x, y, z],
    //     config: { mass: 1, tension: 400, friction: 30 },
    // });

    // cubeMesh.material = [
    //     new MeshStandardMaterial({ color: 0x00ff00 }), // Material for other faces
    //     new MeshStandardMaterial({ color: 0x00ff00 }), // Material for other faces
    //     cubeTopMaterial, // Material for the face where you want to overlay the image
    //     new MeshStandardMaterial({ color: 0x00ff00 }), // Material for other faces
    //     new MeshStandardMaterial({ color: 0x00ff00 }), // Material for other faces
    //     new MeshStandardMaterial({ color: 0x00ff00 }),
    // ];

    return (
        <>
            <mesh {...bind()}>
            {texture && (
                <mesh position={[x.get(), y.get(), z.get()]}>
                    <primitive object={tileMesh}></primitive>
                    <meshStandardMaterial attach="material" map={texture} />
                </mesh>
            )}
            </mesh>
        </>
    );
}