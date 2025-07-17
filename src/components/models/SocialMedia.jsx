import React, { useState } from "react"
import { useGLTF } from "@react-three/drei"

export default function Model({
  showTikTok = true,
  showInstagram = true,
  showDiscord = true,
  showTwitter = true,
  tiktokUrl = "https://tiktok.com/@yourusername",
  instagramUrl = "https://instagram.com/yourusername",
  discordUrl = "https://discord.gg/invitecode",
  twitterUrl = "https://twitter.com/yourusername",
  ...props
}) {
  const { nodes } = useGLTF("/models/socialMedia.glb")
  const [hovered, setHovered] = useState(null)

  const handleSocialClick = url => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <group {...props} dispose={null}>
      {/* Hidden collision mesh for TikTok */}
      <mesh
        geometry={nodes.tikTok.geometry}
        visible={false}
        position={[1.69, 1.402, -0.671]}
        rotation={[0, -1.222, 0]}
        onClick={() => handleSocialClick(tiktokUrl)}
        onPointerOver={e => {
          setHovered("tiktok")
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHovered(null)
          document.body.style.cursor = "auto"
        }}
      />

      {/* Instagram interaction zone */}
      <mesh
        geometry={nodes.instagram.geometry}
        visible={false}
        position={[1.54, 1.407, -0.969]}
        rotation={[0, -1.016, 0]}
        onClick={() => handleSocialClick(instagramUrl)}
        onPointerOver={e => {
          setHovered("instagram")
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHovered(null)
          document.body.style.cursor = "auto"
        }}
      />

      {/* Discord clickable area */}
      <mesh
        geometry={nodes.discord.geometry}
        visible={false}
        position={[1.692, 1.994, -0.668]}
        rotation={[0, -1.222, 0]}
        onClick={() => handleSocialClick(discordUrl)}
        onPointerOver={e => {
          setHovered("discord")
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHovered(null)
          document.body.style.cursor = "auto"
        }}
      />

      {/* Twitter/X interaction mesh */}
      <mesh
        geometry={nodes.x.geometry}
        visible={false}
        position={[1.542, 1.989, -0.966]}
        rotation={[0, -1.016, 0]}
        onClick={() => handleSocialClick(twitterUrl)}
        onPointerOver={e => {
          setHovered("twitter")
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHovered(null)
          document.body.style.cursor = "auto"
        }}
      />
    </group>
  )
}

useGLTF.preload("/models/socialMedia.glb")
