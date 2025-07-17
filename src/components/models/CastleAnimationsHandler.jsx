/** @jsxImportSource react */

import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber'; // Ensure useFrame is imported
import { useGLTF, useAnimations } from '@react-three/drei';
import {
  useCastleFirst_levelCascadeMaterial,
  useCastleSecond_levelCascadeMaterial,
  useDecorMaterial,
  useBowMaterial,
  useLogoMaterial,
} from '../../utils/CastleTextures';
import * as THREE from 'three';

const CastleAnimationsHandler = () => {
  const modelPath = '/models/Castle_Decor_Anims.glb';
  const { scene, animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, scene);

  const mixerRef = useRef();
  mixerRef.current = mixer; // Assign the mixer from useAnimations to the ref

  const defaultScrollSpeed = 1; // Normal speed
  const scrollSpeed = useRef(0.5); // Half speed as an example

  const firstLevelCascadeMaterial = useCastleFirst_levelCascadeMaterial();
  const secondLevelCascadeMaterial = useCastleSecond_levelCascadeMaterial();
  const decorMaterial = useDecorMaterial();

  useEffect(() => {
    if (actions) {
      // Explicitly access and play each action

      scene.traverse((child) => {
        if (child.isMesh) {
          if (child.name === 'first_levelCascade') {
            child.material = firstLevelCascadeMaterial.clone();
            child.material.transparent = true;
            child.material.depthWrite = false; // Disable depth writing for transparency
          } else if (child.name === 'second_levelCascade') {
            child.material = secondLevelCascadeMaterial.clone();
            child.material.transparent = true;
            child.material.depthWrite = false; // Disable depth writing for transparency
          } else if (child.name === 'decor') {
            child.material = decorMaterial.clone();
            child.material.transparent = true;
          }
        }
      });

      if (actions.scroll_down) {
        actions.scroll_down.timeScale = scrollSpeed.current; // Set the timeScale
        actions.scroll_down.loop = THREE.LoopRepeat;
        actions.scroll_down.play();
      }

      if (actions.first_leve) {
        actions.first_leve.loop = THREE.LoopRepeat;
        actions.first_leve.play();
      }

      if (actions.second_level) {
        actions.second_level.loop = THREE.LoopRepeat;
        actions.second_level.play();
      }

      // Note: Assuming the base water animation is also named 'base_water'
      if (actions.base_water) {
        actions.base_water.loop = THREE.LoopRepeat;
        actions.base_water.play();
      }
    }
  }, [actions, scene, firstLevelCascadeMaterial, secondLevelCascadeMaterial, decorMaterial]);

  useFrame((state, delta) => {
    if (mixerRef.current && actions) {
      mixerRef.current.update(delta);

      // Manual looping for 60-frame animations
      const animations60Frames = ['first_leve', 'second_level', 'base_water'];
      animations60Frames.forEach(name => {
        const action = actions[name];
        if (action) {
          // 60 frames at 30 fps is 2 seconds
          if (action.time >= action._clip.duration) { // Check against the actual duration
            action.time = 30; // Reset to the beginning
          }
        }
      });
    }
  });


  // We still need to render the scene returned by useGLTF
  return <primitive object={scene} dispose={null} />; // Render the loaded scene
};

export default CastleAnimationsHandler;