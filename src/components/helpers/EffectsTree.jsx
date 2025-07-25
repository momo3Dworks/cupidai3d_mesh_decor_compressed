import { Bloom, EffectComposer } from "@react-three/postprocessing"
import React, { useMemo } from "react"

export const EffectsTree = () => {
  // Configurações fixas em vez de useControls
  const bloomConfig = {
    enabled: true,
    luminanceThreshold: 20.0,
    intensity: 5.5,
    mipmapBlur: true,
    kernelSize: 4,
    luminanceSmoothing: 2.5,
    radius: 2.5,
  }

  const effectsTree = useMemo(() => {
    return (
      <EffectComposer disableNormalPass multisampling={0}>
        {bloomConfig.enabled && (
          <Bloom
            {...bloomConfig}
            mipmapBlur={false}
            kernelSize={4}
            intensity={0.02}
            
          />
        )}
      </EffectComposer>
    )
  }, [bloomConfig])

  return <>{effectsTree}</>
}
