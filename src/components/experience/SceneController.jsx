import { useState, useEffect, memo } from "react"
import { Perf } from "r3f-perf"
import { useThree } from "@react-three/fiber"
import useCameraAnimation from "../../hooks/useCameraAnimation"
import EnvMapLoader from "../../components/helpers/EnvMapLoader"

const SceneController = memo(({ section, cameraRef, isStarted }) => {
  const [showPerf, setShowPerf] = useState(false)
  const { camera } = useThree()

  useCameraAnimation(section, cameraRef, isStarted)

  useEffect(() => {
    const togglePerf = e => {
      if (e.key.toLowerCase() === "p") {
        setShowPerf(prev => !prev)
      }
    }

    window.addEventListener("keydown", togglePerf)
    return () => window.removeEventListener("keydown", togglePerf)
  }, [])

  useEffect(() => {
    window.threeCamera = camera
    return () => {
      delete window.threeCamera
    }
  }, [camera])

  return (
    <>
      <EnvMapLoader />
      {showPerf && process.env.NODE_ENV !== "production" && (
        <Perf position="top-left" />
      )}
    </>
  )
})

export default SceneController
