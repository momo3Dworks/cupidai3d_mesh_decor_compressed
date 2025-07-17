import React, { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Hook simples para detectar dispositivo móvel
const useMobileDetection = () => {
  // Esta verificação é simples e executada apenas uma vez durante a renderização
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    return mobileRegex.test(userAgent) || window.innerWidth < 768
  }, [])

  return isMobile
}

const FountainParticles = ({
  count = 40,
  color = "lightpink",
  size = 1,
  speed = 0.3,
  spread = 0.5,
  emissionHeight = 0.1,
}) => {
  const points = useRef()
  const particlesData = useRef([])
  const isMobile = useMobileDetection()

  // Ajustar parâmetros para dispositivos móveis
  const adjustedParams = useMemo(() => {
    if (isMobile) {
      return {
        count: Math.floor(count * 0.5), // 50% das partículas
        size: size * 1.2, // Partículas um pouco maiores para compensar
        textureSize: 48, // Textura um pouco maior para melhor brilho
        skipFrames: 2, // Atualizar a cada 2 frames
        simplified: false, // Não simplificar a física
      }
    }
    return {
      count,
      size,
      textureSize: 64,
      skipFrames: 1,
      simplified: false,
    }
  }, [isMobile, count, size])

  // Contador de frames para pular atualizações
  const frameCount = useRef(0)

  // Criar textura para partículas
  const particleTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = adjustedParams.textureSize
    canvas.height = adjustedParams.textureSize
    const ctx = canvas.getContext("2d")
    const center = adjustedParams.textureSize / 2

    const gradient = ctx.createRadialGradient(
      center,
      center,
      0,
      center,
      center,
      center
    )
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)")
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(center, center, center, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [adjustedParams.textureSize])

  // Criar geometria e material para partículas
  const [geometry, material] = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(adjustedParams.count * 3)
    const colors = new Float32Array(adjustedParams.count * 3)
    const sizes = new Float32Array(adjustedParams.count)

    const baseColor = new THREE.Color(color)
    const tempColor = new THREE.Color()

    // Posição fixa em [0, 0.8, 2.406]
    const posX = 0
    const posY = 0.8
    const posZ = 2.406

    // Inicializar buffers
    for (let i = 0; i < adjustedParams.count; i++) {
      const i3 = i * 3

      positions[i3] = (Math.random() - 0.5) * spread + posX
      positions[i3 + 1] = Math.random() * emissionHeight + posY
      positions[i3 + 2] = (Math.random() - 0.5) * spread + posZ

      // Variação de cor (mantida igual ao original)
      tempColor.copy(baseColor)
      tempColor.r *= 0.8 + Math.random() * 0.4
      tempColor.g *= 0.8 + Math.random() * 0.4
      tempColor.b *= 0.8 + Math.random() * 0.4

      colors[i3] = tempColor.r
      colors[i3 + 1] = tempColor.g
      colors[i3 + 2] = tempColor.b

      sizes[i] = Math.random() * adjustedParams.size + adjustedParams.size * 0.5
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    // Material para partículas - mantendo o blending aditivo para o efeito de brilho
    const material = new THREE.PointsMaterial({
      size: adjustedParams.size,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // Mantendo o efeito de brilho em todos os dispositivos
      sizeAttenuation: true,
    })

    return [geometry, material]
  }, [
    adjustedParams.count,
    adjustedParams.size,
    spread,
    emissionHeight,
    color,
    particleTexture,
    isMobile,
  ])

  // Inicializar dados de partículas
  useMemo(() => {
    particlesData.current = []

    // Posição fixa em [0, 0.8, 2.406]
    const posX = 0
    const posY = 0.8
    const posZ = 2.406

    for (let i = 0; i < adjustedParams.count; i++) {
      particlesData.current.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * spread + posX,
          Math.random() * emissionHeight + posY,
          (Math.random() - 0.5) * spread + posZ
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.04 * (spread / 0.2),
          Math.random() * speed + speed * 0.5,
          (Math.random() - 0.5) * 0.04 * (spread / 0.2)
        ),
        size: Math.random() * adjustedParams.size + adjustedParams.size * 0.5,
        lifetime: Math.random() * 2 + 1,
        age: Math.random() * 3,
      })
    }
  }, [adjustedParams.count, adjustedParams.size, spread, emissionHeight, speed])

  // Animar partículas
  useFrame((state, delta) => {
    if (!points.current) return

    // Pular frames em dispositivos móveis
    frameCount.current = (frameCount.current + 1) % adjustedParams.skipFrames
    if (frameCount.current !== 0) return

    // Compensar o delta pelo número de frames pulados
    const adjustedDelta = delta * adjustedParams.skipFrames

    const positions = points.current.geometry.attributes.position.array
    const sizes = points.current.geometry.attributes.size.array

    // Posição fixa em [0, 0.8, 2.406]
    const posX = 0
    const posY = 0.8
    const posZ = 2.406

    // Atualizar cada partícula
    particlesData.current.forEach((particle, i) => {
      const i3 = i * 3

      // Envelhecer partícula
      particle.age += adjustedDelta

      // Reiniciar partícula quando o ciclo de vida termina
      if (particle.age >= particle.lifetime) {
        particle.position.set(
          (Math.random() - 0.5) * spread + posX,
          Math.random() * emissionHeight + posY,
          (Math.random() - 0.5) * spread + posZ
        )

        particle.velocity.set(
          (Math.random() - 0.5) * 0.04 * (spread / 0.2),
          Math.random() * speed + speed * 0.5,
          (Math.random() - 0.5) * 0.04 * (spread / 0.2)
        )

        particle.age = 0
        particle.lifetime = Math.random() * 2 + 1
      }

      // Calcular fase do ciclo de vida
      const lifeProgress = particle.age / particle.lifetime

      // Reduzir velocidade ao subir (simular gravidade e atrito)
      particle.velocity.y *= 0.98

      // Adicionar pequeno movimento aleatório (igual ao original)
      particle.velocity.x += (Math.random() - 0.5) * 0.008
      particle.velocity.z += (Math.random() - 1.5) * 0.008

      // Atualizar posição
      particle.position.add(
        particle.velocity.clone().multiplyScalar(adjustedDelta)
      )

      // Atualizar buffer de posições
      positions[i3] = particle.position.x
      positions[i3 + 1] = particle.position.y
      positions[i3 + 2] = particle.position.z

      // Calcular opacidade baseada no ciclo de vida
      let alpha = 1.0
      if (lifeProgress < 0.1) {
        alpha = lifeProgress / 0.2 // Fade in
      } else if (lifeProgress > 0.7) {
        alpha = 1.0 - (lifeProgress - 0.7) / 0.3 // Fade out
      }

      // Atualizar tamanho (mantendo o efeito visual original para todas as partículas)
      sizes[i] = particle.size * (1 - lifeProgress * 0.6) * alpha
    })

    // Marcar buffers para atualização
    points.current.geometry.attributes.position.needsUpdate = true
    points.current.geometry.attributes.size.needsUpdate = true
  })

  return <points ref={points} geometry={geometry} material={material} />
}

export default FountainParticles
