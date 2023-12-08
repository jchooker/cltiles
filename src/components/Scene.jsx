import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from 'three';

export const Scene = (props) => {
    useThree(({ camera }) => {
        camera.rotation.set(THREE.MathUtils.degToRad(30), 0, 0);
    });
    return <Canvas camera={props.camera} />;
};