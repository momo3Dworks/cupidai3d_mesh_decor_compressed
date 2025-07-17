import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useBowMaterial } from '../../utils/CastleTextures';
import * as THREE from 'three';

const Bow = () => {
  const modelPath = '/models/bow.glb';
  const { scene, animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, scene);

  const bowMaterial = useBowMaterial();

  useEffect(() => {
    if (actions && actions.bowAction) {
      const bowAction = actions.bowAction;
      bowAction.timeScale = 0.2; // Adjust this value to control the speed (less than 1 for slower)
      bowAction.loop = THREE.LoopRepeat;
      bowAction.play();
    }
  }, [actions]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = bowMaterial;
      }
    });
  }, [scene, bowMaterial]);

  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });

  return <primitive object={scene} dispose={null} />;
};

export default Bow;