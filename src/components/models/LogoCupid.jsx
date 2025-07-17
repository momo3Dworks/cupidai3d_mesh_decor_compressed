import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useLogoMaterial } from '../../utils/CastleTextures';
import * as THREE from 'three';

const Logo = () => {
  const modelPath = '/models/logoCupid.glb';
  const { scene, animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, scene);

  const logoMaterial = useLogoMaterial();

  useEffect(() => {
    if (actions && actions.LogoCupidAction) {
      const LogoCupidAction = actions.LogoCupidAction;
      LogoCupidAction.timeScale = 0.2; // Adjust this value to control the speed (less than 1 for slower)
      LogoCupidAction.loop = THREE.LoopRepeat;
      LogoCupidAction.play();
    }
  }, [actions]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = logoMaterial;
      }
    });
  }, [scene, logoMaterial]);

  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });

  return <primitive object={scene} dispose={null} />;
};

export default Logo;