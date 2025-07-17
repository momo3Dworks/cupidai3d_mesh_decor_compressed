import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useBowMaterial } from '../../utils/CastleTextures';
import { useStairsMaterial } from '../../utils/CastleTextures';
import * as THREE from 'three';

const Stairs = () => {
  const modelPath = '/models/stairs.glb';
  const { scene } = useGLTF(modelPath);


  const stairsMaterial = useStairsMaterial();



  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = stairsMaterial;
      }
    });
  }, [scene, stairsMaterial]);

  

  return <primitive object={scene} dispose={null} />;
};

export default Stairs;