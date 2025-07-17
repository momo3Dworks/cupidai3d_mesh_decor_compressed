import React, { useEffect } from "react"
import { useGLTF } from "@react-three/drei"
import PrimaryContent from "./PrimaryContent"
import SecondaryContent from "./SecondaryContent"

const SceneContent = React.memo(
  ({ activeSection, onSectionChange, isReady, isStarted }) => {
    useEffect(() => {
      if (!window.glbAssetsPreloaded) {
        useGLTF.preload("/models/Castle.glb")
        // ... (manter todos os outros preloads)
        window.glbAssetsPreloaded = true
      }
    }, [])

    return (
      <>
        <PrimaryContent
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isReady={isReady}
          isStarted={isStarted}
        />
        <SecondaryContent isReady={isReady} />
      </>
    )
  }
)

export default SceneContent
