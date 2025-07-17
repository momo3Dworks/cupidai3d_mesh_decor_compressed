import React, { useState, useRef, useEffect } from "react"
import { Environment, Sparkles } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import FountainParticles from "../../components/models/FountainParticles"
import Castle from "../../components/models/Castle"
import { Flower } from "../../components/models/Flower"
import { Stairs } from "../../components/models/Stairs"
import Orb from "../../components/models/Orb"
import { Pole } from "../../components/models/Pole"
import { EffectsTree } from "../../components/helpers/EffectsTree"

const PrimaryContent = React.memo(
  ({ activeSection, onSectionChange, isReady, isStarted }) => {
    // ✅ Estado para animação suave com re-render
    const [groundParams, setGroundParams] = useState({
      height: 5,
      radius: 130,
      scale: 100,
    })

    // ✅ Estados para animação suave
    const animationState = useRef({
      isAnimating: false,
      startTime: 0,
      startRadius: 130,
      startScale: 100,
      targetRadius: 13,
      targetScale: 22,
      duration: 2500,
      delay: 400,
    })

    const hasAnimatedRef = useRef(false)

    // ✅ CONTROLE DE INÍCIO DA ANIMAÇÃO
    useEffect(() => {
      // ✅ Resetar se não estiver started
      if (!isStarted) {
        hasAnimatedRef.current = false
        animationState.current.isAnimating = false
        setGroundParams({
          height: 5,
          radius: 130,
          scale: 100,
        })
        return
      }

      // ✅ Só animar se started E ainda não animou
      if (isStarted && !hasAnimatedRef.current) {
        hasAnimatedRef.current = true

        setTimeout(() => {
          animationState.current = {
            ...animationState.current,
            isAnimating: true,
            startTime: performance.now(),
            startRadius: groundParams.radius,
            startScale: groundParams.scale,
          }
        }, animationState.current.delay)
      }
    }, [isStarted, groundParams.radius, groundParams.scale])

    // ✅ ANIMAÇÃO SUAVE COM useFrame
    useFrame(() => {
      if (!animationState.current.isAnimating) return

      const elapsed = performance.now() - animationState.current.startTime
      const progress = Math.min(elapsed / animationState.current.duration, 1)

      // ✅ Easing function (sine.inOut)
      const easeInOut = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
      const easedProgress = easeInOut(progress)

      // ✅ Interpolar valores
      const { startRadius, startScale, targetRadius, targetScale } =
        animationState.current

      const newRadius =
        startRadius + (targetRadius - startRadius) * easedProgress
      const newScale = startScale + (targetScale - startScale) * easedProgress

      // ✅ Atualizar state para forçar re-render
      setGroundParams(prev => ({
        ...prev,
        radius: newRadius,
        scale: newScale,
      }))

      // ✅ Animação completa
      if (progress >= 1) {
        animationState.current.isAnimating = false
        setGroundParams(prev => ({
          ...prev,
          radius: targetRadius,
          scale: targetScale,
        }))
      }
    })

    return (
      <>
        <Environment
          files="/images/CloudsBG.hdr"
          background
          resolution={256}
          ground={{
            height: groundParams.height,
            radius: groundParams.radius,
            scale: groundParams.scale,
          }}
        />
        <Sparkles
          count={80}
          size={Array.from({ length: 25 }, () => 4 + Math.random() * 2)}
          scale={[10, 3, 10]}
          position={[0, 6, 0]}
          speed={0.01}
          color="#ff00ff"
          opacity={0.1}
        />
        <EffectsTree />
        <FountainParticles
          count={80}
          color="lightpink"
          size={0.03}
          speed={0.65}
          spread={0.3}
          layers-enable={2}
          castShadow={false}
          receiveShadow={false}
        />
        <Castle
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          scale={[2, 1.6, 2]}
          isStarted={isStarted}
        />
        <Flower />
        <Stairs />
        <Orb />
        <Pole
          position={[-0.8, 0, 5.8]}
          scale={[0.6, 0.6, 0.6]}
          onSectionChange={onSectionChange}
        />
      </>
    )
  }
)

export default PrimaryContent
