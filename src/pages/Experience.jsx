import React, { useState, useRef, useCallback, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import useMobileDetection from "../hooks/useMobileDetection"
import { getCanvasConfig } from "../utils/canvasConfig"
import SceneController from "../components/experience/SceneController"
import SceneContent from "../components/experience/SceneContent"
import { CastleUi } from "./CastleUi" // Corrigido para named import
import AudioControl from "../components/AudioControl"

const Experience = ({ initiallyReady = false, isStarted = false }) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [activeSection, setActiveSection] = useState("intro")
  const cameraRef = useRef(null)
  const isInitialized = useRef(false)
  const isMobile = useMobileDetection()
  const canvasConfig = getCanvasConfig(isMobile)

  const handleSectionChange = useCallback((index, sectionName) => {
    setCurrentSection(index)
    setActiveSection(sectionName)
  }, [])

  const handleCustomCameraPosition = useCallback((position, target) => {
    if (cameraRef.current?.camera) {
      cameraRef.current.camera.position.set(...position)
      cameraRef.current.camera.lookAt(...target)
      cameraRef.current.camera.updateProjectionMatrix()
    }
  }, [])

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    window.customCameraNavigation = handleCustomCameraPosition
    window.onSectionChange = handleSectionChange

    const handleSectionChangeEvent = event => {
      if (event.detail?.sectionIndex !== undefined) {
        handleSectionChange(event.detail.sectionIndex, event.detail.sectionName)
      }
    }

    window.addEventListener("sectionChange", handleSectionChangeEvent)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.audioManager?.pauseAll?.()
      } else {
        window.audioManager?.resumeAll?.()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("sectionChange", handleSectionChangeEvent)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      delete window.customCameraNavigation
      delete window.onSectionChange
    }
  }, [handleSectionChange, handleCustomCameraPosition])

  useEffect(() => {
    if (isStarted) {
      window.audioManager?.startAmbient?.()
      return () => {
        window.audioManager?.stopAmbient?.()
      }
    }
  }, [isStarted])

  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 z-0">
        <Canvas {...canvasConfig} className="w-full h-full">
          <SceneController
            section={currentSection}
            cameraRef={cameraRef}
            isStarted={isStarted}
          />
          <SceneContent
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            isReady={true}
            isStarted={isStarted}
          />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="w-full h-full">
          <CastleUi
            section={currentSection}
            onSectionChange={handleSectionChange}
            cameraRef={cameraRef.current}
            className="pointer-events-auto"
          />
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-20">
        <AudioControl />
      </div>
    </div>
  )
}

export default Experience
