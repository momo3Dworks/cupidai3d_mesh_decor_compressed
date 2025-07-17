import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TextureAnimator = ({ mesh, speed = 0.01 }) => {
  const textureRef = useRef(null);

  useEffect(() => {
    if (mesh && mesh.material && mesh.material.map) {
      textureRef.current = mesh.material.map;
      textureRef.current.wrapS = THREE.RepeatWrapping;
    }
  }, [mesh]);

  useFrame((state, delta) => {
    if (textureRef.current) {
      textureRef.current.offset.x = (textureRef.current.offset.x + delta * speed) % 1;
    }
  });

  // This component doesn't render anything visible, it just performs updates
  return null;
};

export default TextureAnimator;