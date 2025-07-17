import { useTexture } from "@react-three/drei"
import React, { useMemo, useEffect, useState } from "react"
import * as THREE from "three"
import {
  Color,
  DoubleSide,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NearestFilter,
  NormalBlending,
  Vector2,
} from "three"
import {
  useSharedEnvironmentMaps,
  useBg1Environment,
  useStudioEnvironment,
  useCloudsEnvironment,
} from "./useSharedEnvironmentMaps"
import { CustomBlending } from "three"

const useCastleTextures = () => {
  return useTexture({
    first_levelCascadeColor: "/texture/OCEAN Color.avif",
    first_levelCascadeRoughness: "/texture/OCEAN Roughness.avif",
    first_levelCascadeMetallic: "/texture/OCEAN Metallic.avif", // Asegúrate de que tengas un mapa metálico para el primer nivel si lo necesitas
    // Si no tienes un mapa metálico separado para el primer nivel, puedes usar el del segundo nivel o eliminar esta línea si no es necesaria.
    // Por ahora, asumiré que existe uno o que el del segundo nivel es adecuado si es el mismo.
    first_levelCascadeNormal: "/texture/OCEAN Normal.avif",
    first_levelCascadeAlpha: "/texture/OCEAN Alpha.avif",
    
    second_levelCascadeColor: "/texture/OCEAN Color.avif",
    second_levelCascadeRoughness: "/texture/OCEAN Roughness.avif",
    second_levelCascadeMetallic: "/texture/OCEAN Metallic.avif",
    second_levelCascadeNormal: "/texture/OCEAN Normal.avif",
    second_levelCascadeAlpha: "/texture/OCEAN Alpha.avif",
    
    base_waterColor: "/texture/OCEAN Color.001.avif",
    base_waterRoughness: "/texture/OCEAN Roughness.001.avif",
    base_waterMetallic: "/texture/OCEAN Metallic.001.avif",
    base_waterNormal: "/texture/OCEAN Normal.001.avif",

    

    castleColor: "/texture/castle_NewColor.avif",
    castleRoughness: "/texture/castle_NewRoughness.avif",
    castleMetallic: "/texture/castle_NewMetallic.avif",
    newColumnsColor: "/texture/Columns_NewColor.avif",
    newColumnsNormals: "/texture/ColumnsNewNormals1.avif", 
    newColumnsRoughness: "/texture/Columns_NewRoughness.avif",
    castleHeartColor: "/texture/castleHeart_Base_colorAO.avif",
    castleLightsEmissive: "/texture/castleLights_Emissive.avif",
    godsWallColor: "/texture/GodsWallColor.avif",
    godsWallRoughness: "/texture/castleGodsWall_Roughness.avif",
    decorColor: "/texture/Ornaments_Color.avif",
    decorRoughness: "/texture/Ornaments_Roughness.avif",
    decorMetallic: "/texture/Ornaments_Metallic.avif",
    decorNormal: "/texture/AllDecorNormal_Alphas.avif",
    decorAlpha: "texture/Ornaments_alphas.avif",
    wallsColor: "/texture/walls_NewColor.avif",
    wallsRoughness: "/texture/walls_NewRoughness.avif",
    
    pilarsColor: "/texture/castlePilars_Color.avif",
    pilarsRoughness: "/texture/castlePilars_Roughness.avif",
    pilarsMetallic: "/texture/castlePilars_Metallic.avif",
    pilarsEmissive: "/texture/castlePilars_Emission.avif",
    floorAO: "/texture/floor_NewColor.avif",
    floorEmissive: "/texture/floorAO.avif",
    floorRoughness: "/texture/floor_NewRoughness.avif", 
    floorMetallic: "/texture/Ornaments_Roughness.avif",
    floorHeartColor: "/texture/floorHeart_NewColor.avif",
    floorHeartMetallic: "/texture/floorHeart_Metallic.avif",
    floorHeartRoughness: "/texture/floorHeart_Roughness.avif",
    floorHeartEmissive: "/texture/floorHeart_Emissive.avif",
    wingsColor: "/texture/wingsColor_.avif",
    wingsRoughness: "/texture/wingsRoughness.avif",
    godsColorAO: "/texture/godsColorAO.avif",
    hoofGlassColor: "/texture/hoofGlassColorBAO.avif",
    hoofGlassEmissive: "/texture/hoofGlassEmissiveV2.avif",
    atmBake: "/texture/atmBake1.avif",
    atmMetallic: "/texture/atmMetallicV1.avif",
    atmEmissive: "/texture/atmEmissive.avif",
    scrollColor: "/texture/ScrollColorV1.avif",
    stairsColor: "/texture/stairs_Color.avif",
    stairsRoughness: "/texture/Ornaments_Roughness.avif"
    
  })
}



const configureTextures = (textures, flipY = true) => {
  Object.entries(textures).forEach(([key, texture]) => {
    if (texture) {
      texture.flipY = flipY
      texture.minFilter = texture.magFilter = NearestFilter
      if (key.toLowerCase().includes('alpha')) {
        texture.colorSpace = THREE.NoColorSpace;
      } else if (texture.isTexture && texture.image && texture.image.width > 0) { // Check if it's a loaded texture before setting sRGB
        texture.colorSpace = THREE.SRGBColorSpace;
      }
    }
  })
}


export const useStairsMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({
      stairsColor: textures.stairsColor,
      stairsRoughness: textures.stairsRoughness,
    
    })
  }, [textures])

  useMemo(() => {
    if (textures.stairsColor) {
      textures.stairsColor.flipY = false
      textures.stairsColor.minFilter = textures.stairsColor.magFilter =
        NearestFilter
      textures.stairsColor.colorSpace = "srgb"
    }
    
 

   

  }, [textures])


  return useMemo(() => {
    return new MeshStandardMaterial({
      map: textures.stairsColor,
      roughnessMap: textures.stairsRoughness,
      
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughness: 0.1,
      metalness: 0.5,
      blending: NormalBlending,
      normalMapType: THREE.ObjectSpaceNormalMap,
      envMap: bg1Env,
      envMapIntensity: 1.5,
      side: DoubleSide,
      transparent: false,
    })
  }, [textures, bg1Env])
}

export const useCastleMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({
      castleColor: textures.castleColor,
      castleRoughness: textures.castleRoughness,
      castleMetallic: textures.castleMetallic,
      castleNormal: textures.castleNormal,
    })
  }, [textures])

  useMemo(() => {
    if (textures.castleColor) {
      textures.castleColor.flipY = false
      textures.castleColor.minFilter = textures.castleColor.magFilter =
        NearestFilter
      textures.castleColor.colorSpace = "srgb"
    }

    if (textures.castleRoughness) {
      textures.castleRoughness.flipY = false
      textures.castleRoughness.minFilter = textures.castleRoughness.magFilter =
        NearestFilter
      textures.castleRoughness.colorSpace = "srgb"
    }
    if (textures.castleMetallic) {
      textures.castleMetallic.flipY = false
      textures.castleMetallic.minFilter = textures.castleMetallic.magFilter =
        NearestFilter
      textures.castleMetallic.colorSpace = "srgb"
    }
    if (textures.castleNormal) {
      textures.castleNormal.flipY = false
      textures.castleNormal.minFilter = textures.castleNormal.magFilter =
        NearestFilter
      textures.castleNormal.colorSpace = "srgb"
    }

   

  }, [textures])


  return useMemo(() => {
    return new MeshStandardMaterial({
      map: textures.castleColor,
      roughnessMap: textures.castleRoughness,
      metalnessMap: textures.castleMetallic,
     
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughness: 0.2,
      metalness: 0,
      blending: NormalBlending,
      envMap: bg1Env,
      envMapIntensity: 1,
      side: DoubleSide,
      transparent: false,
    })
  }, [textures, bg1Env])
}


export const useCastleNewColumnsMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({
      newColumnsColor: textures.newColumnsColor,
      newColumnsRoughness: textures.newColumnsRoughness,
      newColumnNormals: textures.newColumnNormals,
    })
  }, [textures])

  useMemo(() => {
    if (textures.newColumnsColor) {
      textures.newColumnsColor.flipY = false
      textures.newColumnsColor.minFilter = textures.newColumnsColor.magFilter =
        NearestFilter
      textures.newColumnsColor.colorSpace = "srgb"
    }


   
    if (textures.newColumnNormals) {
      textures.newColumnNormals.flipY = false
      textures.newColumnsNormals.minFilter = textures.newColumnsNormals.magFilter =
        NearestFilter
      textures.newColumnsNormals.colorSpace = "srgb"
    }
    if (textures.newColumnsRoughness) {
      textures.newColumnsRoughness.flipY = false
      textures.newColumnsRoughness.minFilter = textures.newColumnsRoughness.magFilter =
        NearestFilter
      textures.newColumnsRoughness.colorSpace = "srgb"
    }

   

  }, [textures])


  return useMemo(() => {
    return new MeshStandardMaterial({
      map: textures.newColumnsColor,
      roughnessMap: textures.newColumnsRoughness ,
      
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughness: 0.2,
      metalness: 0,
      blending: NormalBlending,
      envMap: bg1Env,
      envMapIntensity: 1,
      side: DoubleSide,
      transparent: false,
    })
  }, [textures, bg1Env])
}


export const useCastleFirst_levelCascadeMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

 useMemo(() => {
    configureTextures({
      map: textures.first_levelCascadeColor,
      first_levelCascadeRoughness: textures.first_levelCascadeRoughness,
      first_levelCascadeMetallic: textures.first_levelCascadeMetallic,
      first_levelCascadeNormal: textures.first_levelCascadeNormal,
 first_levelCascadeAlpha: textures.first_levelCascadeAlpha, // Asegúrate de que este es el mapa alfa correcto para el primer nivel.
     
    
    })
  }, [textures])

  return useMemo(() => {
    return new MeshStandardMaterial({
      map: textures.first_levelCascadeColor,
      roughnessMap: textures.first_levelCascadeRoughness,
      metalnessMap: textures.first_levelCascadeMetallic,
      alphaMap: textures.first_levelCascadeAlpha,
      normalMap: textures.first_levelCascadeNormal,
  
      normalScale: new THREE.Vector2(0.5, 0.5),
      alphaTest: 0.001, // Add alphaTest
      roughness: 0,
      metalness: 0.3,
      blending: NormalBlending,
      envMap: bg1Env,
      envMapIntensity: 2.5,
      side: DoubleSide,
      transparent: true,
      depthTest: true,
      
    })
  }, [textures, bg1Env])
}

export const useCastleSecond_levelCascadeMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({
      map: textures.first_levelCascadeColor,
      first_levelCascadeRoughness: textures.first_levelCascadeRoughness,
      first_levelCascadeMetallic: textures.first_levelCascadeMetallic,
 first_levelCascadeNormal: textures.first_levelCascadeNormal, // Asegúrate de que este es el mapa normal correcto para el segundo nivel.
      first_levelCascadeAlpha: textures.first_levelCascadeAlpha,
      
    
    })
  }, [textures])

  return useMemo(() => {
    return new MeshStandardMaterial({
      map: textures.first_levelCascadeColor,
      roughnessMap: textures.first_levelCascadeRoughness,
      metalnessMap: textures.first_levelCascadeMetallic,
 alphaMap: textures.second_levelCascadeAlpha, // Corrected alpha map
      normalMap: textures.first_levelCascadeNormal,
      transparent: true,
     
     
      roughness: 0,
      metalness: 0.3,
      alphaTest: 0.001, // Add alphaTest
      blending: NormalBlending,
      envMap: bg1Env,
      envMapIntensity: 2.5,
      side: DoubleSide,
      depthTest: true,
      
    })
  }, [textures, bg1Env])
}

export const useCastleBase_WaterMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({
      map: textures.base_waterColor,
      base_waterRoughness: textures.base_waterRoughness,
      base_waterMetallic: textures.base_waterMetallic,
      base_waterNormal: textures.base_waterNormal,
      
   
    
    })
  }, [textures])

  return useMemo(() => {
    return new MeshStandardMaterial({
      map: textures.base_waterColor,
      roughnessMap: textures.base_waterRoughness,
      metalnessMap: textures.base_waterMetallic,
      
      normalMap: textures.base_waterNormal,
     
   
      roughness: 0,
      metalness: 0.3,
      blending: NormalBlending,
      envMap: bg1Env,
      envMapIntensity: 1,
      side: DoubleSide,
      transparent: false,
    })
  }, [textures, bg1Env])
}



export const useCastleHeartMaterial = (
  metalness = 1.1,
  roughness = 0,
  emissiveIntensity = 0.3,
  emissiveColor = "#ff0000"
) => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({ castleHeartColor: textures.castleHeartColor })
  }, [textures])

  useMemo(() => {
    if (textures.castleHeartColor) {
      textures.castleHeartColor.flipY = false
      textures.castleHeartColor.minFilter = textures.castleHeartColor.magFilter =
        NearestFilter
      textures.castleHeartColor.colorSpace = "srgb"
    }

  
   

  }, [textures])
  

  return useMemo(() => {
    return new MeshStandardMaterial({
      map: textures.castleHeartColor,
      side: DoubleSide,
      transparent: false,
      alphaTest: 0.05,
      roughness: roughness,
      metalness: metalness,
      emissive: new Color(emissiveColor),
      emissiveIntensity: emissiveIntensity,
      blending: NormalBlending,
      envMap: bg1Env,
    })
  }, [textures, metalness, roughness, emissiveIntensity, emissiveColor, bg1Env])
}

export const useCastleHeartMaskMaterial = () => {
  const studioEnv = useStudioEnvironment()

  return useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: new Color("#E8B84E"),
        transparent: false,
        alphaTest: 0.05,
        side: DoubleSide,
        blending: NormalBlending,
        roughness: 0.2,
        metalness: 1.5,
        envMap: studioEnv,
        envMapIntensity: 1.5,
        emissive: new Color("#F0D060"),
        emissiveIntensity: 0.3,
      }),
    [studioEnv]
  )
}

export const useCastleLightsMaterial = () => {
  const textures = useCastleTextures()

  return useMemo(
    () =>
      new MeshStandardMaterial({
        emissive: new Color("#fff"),
        emissiveIntensity: 1,
        emissiveMap: textures.castleLightsEmissive,
        side: DoubleSide,
      }),
    [textures]
  )
}

export const usecastleGodsWallsMaterial = (
  materialType = "standard",
  metalness = 0.6,
  roughness = 1.6
) => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({
      godsWallColor: textures.godsWallColor,
      godsWallRoughness: textures.godsWallRoughness,
    })
  }, [textures])

  return useMemo(() => {
    const commonProps = {
      map: textures.godsWallColor,
      side: DoubleSide,
      transparent: false,
    }

    const pbrProps = {
      ...commonProps,
      roughnessMap: textures.godsWallRoughness,
      roughness: roughness,
      metalness: metalness,
      blending: NormalBlending,
      envMap: bg1Env,
      envMapIntensity: 2.5,
    }

    switch (materialType) {
      case "physical":
        return new MeshStandardMaterial(pbrProps)
      case "basic":
        return new MeshBasicMaterial({
          ...commonProps,
          color: new Color(0xffffff),
        })
      case "standard":
      default:
        return new MeshStandardMaterial(pbrProps)
    }
  }, [textures, materialType, metalness, roughness, bg1Env])
}

export const useCastleWallsMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({
      wallsColor: textures.wallsColor,
      wallsRoughness: textures.wallsRoughness,
    })
  }, [textures])

  useMemo(() => {
    if (textures.wallsColor) {
      textures.wallsColor.flipY = false
      textures.wallsColor.minFilter = textures.wallsColor.magFilter =
        NearestFilter
      textures.wallsColor.colorSpace = "srgb"
    }

    if (textures.wallsRoughness) {
      textures.wallsRoughness.flipY = false
      textures.wallsRoughness.minFilter = textures.wallsRoughness.magFilter =
        NearestFilter
      textures.wallsRoughness.colorSpace = "srgb"
    }

   

  }, [textures])

  return useMemo(() => {
    return new MeshStandardMaterial({
      map: textures.wallsColor,
      roughnessMap: textures.wallsRoughness,
      roughness: 0.2,
      blending: NormalBlending,
      envMap: bg1Env,
      envMapIntensity: 1,
      side: DoubleSide,
      transparent: false,
      alphaTest: 0.05,
      emissive: new Color("#FFFFFF"),
      emissiveIntensity: 0.3,
    })
  }, [textures, bg1Env])
}



export const useCastlePilarsMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({
      pilarsColor: textures.pilarsColor,
      pilarsRoughness: textures.pilarsRoughness,
      pilarsMetallic: textures.pilarsMetallic,
      pilarsEmissive: textures.pilarsEmissive,
    })
  }, [textures])

  useMemo(() => {
    if (textures.pilarsColor) {
      textures.pilarsColor.flipY = false
      textures.pilarsColor.minFilter = textures.pilarsColor.magFilter =
        NearestFilter
      textures.pilarsColor.colorSpace = "srgb"
    }

    if (textures.pilarsRoughness) {
      textures.pilarsRoughness.flipY = false
      textures.pilarsRoughness.minFilter = textures.pilarsRoughness.magFilter =
        NearestFilter
      textures.pilarsRoughness.colorSpace = "srgb"
    }

    if (textures.pilarsMetallic) {
      textures.pilarsMetallic.flipY = false
      textures.pilarsMetallic.minFilter = textures.pilarsMetallic.magFilter =
        NearestFilter
      textures.pilarsMetallic.colorSpace = "srgb"
    }
    if (textures.pilarsEmissive) {
      textures.pilarsEmissive.flipY = false
      textures.pilarsEmissive.minFilter = textures.pilarsEmissive.magFilter =
        NearestFilter
      textures.pilarsEmissive.colorSpace = "srgb"
    }
   

  }, [textures])
 

  return useMemo(() => {
    return new MeshStandardMaterial({
      
      map: textures.pilarsColor,
      roughnessMap: textures.pilarsRoughness,
      metalnessMap: textures.pilarsMetallic,
      emissiveMap: textures.pilarsEmissive,
      emissive: new Color(0xe8b84e),
      emissiveIntensity: 1,
      roughness: 1,
      metalness: 0,
      blending: NormalBlending,
      envMap: bg1Env,
      envMapIntensity: 1.0,
      side: DoubleSide,
      transparent: false,
      alphaTest: 0.05,
    })
  }, [textures, bg1Env])
}


export const useFloorMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({
      floorAO: textures.floorAO,
      floorRoughness: textures.floorRoughness,
      floorHeartMetallic: textures.floorHeartMetallic,
      
    })
  }, [textures])

  useMemo(() => {
    if (textures.floorAO) {
      textures.floorAO.flipY = false
      textures.floorAO.minFilter = textures.floorAO.magFilter =
        NearestFilter
      textures.floorAO.colorSpace = "srgb"
    }

   

    if (textures.floorMetallic) {
      textures.floorMetallic.flipY = false
      textures.floorMetallic.minFilter = textures.floorMetallic.magFilter =
        NearestFilter
        textures.floorMetallic.colorSpace = THREE.NoColorSpace
    }

    
  

  }, [textures])

  return useMemo(() => {
    return new MeshStandardMaterial({
      map: textures.floorAO,
      roughnessMap: textures.floorRoughness,
      metalnessMap: textures.floorHeartMetallic,
     
      roughness: 0.0,
      metalness: 1.3,
      blending: NormalBlending,
      envMap: bg1Env,
      envMapIntensity: 0.4,
      side: DoubleSide,
      transparent: false,
      alphaTest: 0.05,
     
    })
  }, [textures, bg1Env])
}

export const useMirrorFrameMaterial = () => {
  const studioEnv = useStudioEnvironment()

  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#E8B84E"),
        transparent: false,
        alphaTest: 0.05,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
        roughness: 0,
        metalness: 1,
        envMap: studioEnv,
        envMapIntensity: 2.2,
        emissive: new THREE.Color("#F0D060"),
        emissiveIntensity: 0.1,
      }),
    [studioEnv]
  )
}

export const useFloorHeartMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({
      floorHeartColor: textures.floorHeartColor,
      floorHeartRoughness: textures.floorHeartRoughness,
      floorHeartMetallic: textures.floorHeartMetallic,
      floorHeartEmissive: textures.floorHeartEmissive,
    })
  }, [textures])

  useMemo(() => {
    if (textures.floorHeartColor) {
      textures.floorHeartColor.flipY = false
      textures.floorHeartColor.minFilter = textures.floorHeartColor.magFilter =
        NearestFilter
      textures.floorHeartColor.colorSpace = "srgb"
    }

   if (textures.floorHeartRoughness) {
      textures.floorHeartRoughness.flipY = false
      textures.floorHeartRoughness.minFilter = textures.floorHeartRoughness.magFilter =
        NearestFilter
     textures.floorHeartRoughness.colorSpace = THREE.NoColorSpace
    }

    if (textures.floorHeartMetallic) {
      textures.floorHeartMetallic.flipY = false
      textures.floorHeartMetallic.minFilter = textures.floorHeartMetallic.magFilter =
        NearestFilter
      textures.floorHeartMetallic.colorSpace = THREE.NoColorSpace
    }

    if (textures.floorHeartEmissive) {
      textures.floorHeartEmissive.flipY = false
      textures.floorHeartEmissive.minFilter = textures.floorHeartEmissive.magFilter =
        NearestFilter
      textures.floorHeartEmissive.colorSpace = "srgb"
    }

  }, [textures])



  return useMemo(() => {
    return new MeshPhysicalMaterial({
      map: textures.floorHeartColor,
      roughnessMap: textures.floorHeartRoughness,
      metalnessMap: textures.floorHeartMetallic,
      emissiveMap: textures.floorHeartEmissive,
      side: DoubleSide,
      roughness: 0.0,
      metalness: 1.3,
      reflectivity: 0.0,
      emissive: new Color("#578fd7"),
      emissiveIntensity: 8,
      transparent: false,
      blending: NormalBlending,
      envMap: bg1Env,
      envMapIntensity: 1.0,
      iridescence: 0.0,
    })
  }, [textures, bg1Env])
}

export const useWingsMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({
      wingsColor: textures.wingsColor,
      wingsRoughness: textures.wingsRoughness,
    })
  }, [textures])


  useMemo(() => {
    if (textures.wingsColor) {
      textures.wingsColor.flipY = false
      textures.wingsColor.minFilter = textures.wingsColor.magFilter =
        NearestFilter
      textures.wingsColor.colorSpace = "srgb"
    }



    if (textures.wingsRoughness) {
      textures.wingsRoughness.flipY = false
      textures.wingsRoughness.minFilter = textures.wingsRoughness.magFilter =
        NearestFilter
      textures.wingsRoughness.colorSpace = THREE.NoColorSpace
    }

  }, [textures])

  return useMemo(
    () =>
      new MeshStandardMaterial({
        map: textures.wingsColor,
        roughnessMap: textures.wingsRoughness,
        emissiveMap: textures.wingsColor,
        roughness: 0.2,
        blending: NormalBlending,
        envMap: bg1Env,
        envMapIntensity: 1.8,
        side: DoubleSide,
        transparent: false,
        alphaTest: 0.05,
      }),
    [textures, bg1Env]
  )
}

export const useLogoMaterial = () => {
  const bg1Env = useBg1Environment()

  return useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: new Color("#FA3C81"),
        transparent: false,
        alphaTest: 0.05,
        side: DoubleSide,
        blending: NormalBlending,
        roughness: 0.3,
        metalness: 1.3,
        envMap: bg1Env,
        envMapIntensity: 1.2,
      }),
    [bg1Env]
  )
}

export const useDecorMaterial = () => {


  const studioEnv = useStudioEnvironment()





  return useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: new Color("#FCF4A3"),
        
        transparent: false,
        alphaTest: 0.05,
        side: THREE.DoubleSide,
        blending: NormalBlending,
        roughness: 0,
        metalness: 1.3,
        envMap: studioEnv,
        envMapIntensity: 2,
      }),
    [studioEnv]
  )
}

export const useBowMaterial = () => {
  const studioEnv = useStudioEnvironment()

  return useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: new Color("#F9DD71"),
        transparent: false,
        alphaTest: 0.05,
        side: DoubleSide,
        blending: NormalBlending,
        roughness: 0,
        metalness: 1.2,
        envMap: studioEnv,
        envMapIntensity: 1.8,
      }),
    [studioEnv]
  )
}

export const useMirrorMaterial = () => {
  const cloudsEnv = useCloudsEnvironment()

  return useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: new Color("#a6cce5"),
        transparent: false,
        alphaTest: 0.05,
        side: DoubleSide,
        blending: NormalBlending,
        roughness: 0,
        metalness: 1,
        envMap: cloudsEnv,
        envMapIntensity: 2.0,
      }),
    [cloudsEnv]
  )
}

export const useHallosMaterial = () => {
  const studioEnv = useStudioEnvironment()

  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#DABB46"),
        transparent: false,
        alphaTest: 0.05,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
        roughness: 0.2,
        metalness: 2,
        envMap: studioEnv,
        envMapIntensity: 2.5,
        reflectivity: 0,
        emissive: new THREE.Color("#DABB46").multiplyScalar(0.1),
        emissiveIntensity: 2,
      }),
    [studioEnv]
  )
}

export const useGodsMaterial = () => {
  const textures = useCastleTextures()

  useMemo(() => {
    if (textures.godsColorAO) {
      textures.godsColorAO.flipY = false
      textures.godsColorAO.minFilter = textures.godsColorAO.magFilter =
        NearestFilter
      textures.godsColorAO.colorSpace = "srgb"
    }
  }, [textures])

  return useMemo(
    () =>
      new MeshBasicMaterial({
        map: textures.godsColorAO,
        transparent: false,
        alphaTest: 0.5,
        side: DoubleSide,
        blending: NormalBlending,
      }),
    [textures]
  )
}

export const useHoofMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    configureTextures({
      hoofGlassColor: textures.hoofGlassColor,
      hoofGlassEmissive: textures.hoofGlassEmissive,
    })
  }, [textures])




  useMemo(() => {
    if (textures.hoofGlassColor) {
      textures.hoofGlassColor.flipY = false
      textures.hoofGlassColor.minFilter = textures.hoofGlassColor.magFilter =
        NearestFilter
      textures.hoofGlassColor.colorSpace = "srgb"
    }



    if (textures.hoofGlassEmissive) {
      textures.hoofGlassEmissive.flipY = false
      textures.hoofGlassEmissive.minFilter = textures.hoofGlassEmissive.magFilter =
        NearestFilter
      textures.hoofGlassColor.colorSpace = "srgb"
    }

  }, [textures])

  return useMemo(
    () =>
      new MeshPhysicalMaterial({
        map: textures.hoofGlassColor,
        emissiveMap: textures.hoofGlassEmissive,
        emissive: new Color(0x578fd7),
        emissiveIntensity: 18,
        transparent: false,
        side: DoubleSide,
        blending: NormalBlending,
        roughness: 0.2,
        metalness: 1,
        envMap: bg1Env,
        envMapIntensity: 1.0,
        reflectivity: 0.5,
      }),
    [textures, bg1Env]
  )
}

export const useAtmMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

  useMemo(() => {
    if (textures.hoofGlassColor) {
      textures.atmBake.flipY = false
      textures.atmBake.minFilter = textures.atmBake.magFilter =
        NearestFilter
      textures.atmBake.colorSpace = "srgb"
    }

    if (textures.atmMetallic) {
      textures.atmMetallic.flipY = false
      textures.atmMetallic.minFilter = textures.atmMetallic.magFilter =
        NearestFilter
      textures.atmMetallic.colorSpace = "srgb"
    }

    if (textures.atmMetallic) {
      textures.atmEmissive.flipY = false
      textures.atmEmissive.minFilter = textures.atmEmissive.magFilter =
        NearestFilter
      textures.atmEmissive.colorSpace = "srgb"
    }
  }, [textures])

  useMemo(() => {
    configureTextures({
      atmBake: textures.atmBake,
      atmMetallic: textures.atmMetallic,
      atmEmissive: textures.atmEmissive,
    })
  }, [textures])

  return useMemo(
    () =>
      new MeshStandardMaterial({
        map: textures.atmBake,
        metalnessMap: textures.atmMetallic,
        emissiveMap: textures.atmEmissive,
        transparent: false,
        side: DoubleSide,
        blending: NormalBlending,
        metalness: 1.5,
        roughness: 0.5,
        emissive: new Color(0xc4627d),
        emissiveIntensity: -0.5,
        envMap: bg1Env,
        envMapIntensity: 0.8,
      }),
    [textures, bg1Env]
  )
}

export const useAtmMetalMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()

 

  
  useMemo(() => {
    configureTextures({
      atmBake: textures.atmBake,
      atmEmissive: textures.atmEmissive,
    })
  }, [textures])

  return useMemo(
    () =>
      new MeshStandardMaterial({
        map: textures.atmBake,
        emissiveMap: textures.atmEmissive,
        transparent: false,
        alphaTest: 0.05,
        side: DoubleSide,
        blending: NormalBlending,
        metalness: 1.3,
        roughness: 0.05,
        emissive: new Color(0xc4627d),
        emissiveIntensity: 7.5,
        envMap: bg1Env,
        envMapIntensity: 1.5,
      }),
    [textures, bg1Env]
  )
}

export const useScrollMaterial = () => {
  const textures = useCastleTextures()
  const bg1Env = useBg1Environment()
  const [hasError, setHasError] = useState(false)


  useMemo(() => {
    if (textures.scrollColor) {
      textures.scrollColor.flipY = false
      textures.scrollColor.minFilter = textures.scrollColor.magFilter =
        NearestFilter
      textures.scrollColor.colorSpace = "srgb"
    }

  }, [textures])


  useEffect(() => {
    if (!textures.scrollColor || textures.scrollColor.image === undefined) {
      setHasError(true)
    }
  }, [textures])

  if (hasError) {
    return useMemo(
      () =>
        new MeshStandardMaterial({
          color: "#f0e6d2",
          roughness: 0.7,
          metalness: 0.0,
          side: DoubleSide,
          envMap: bg1Env,
          envMapIntensity: 0.3,
        }),
      [bg1Env]
    )
  }

  return useMemo(
    () =>
      new MeshStandardMaterial({
        map: textures.scrollColor,
        roughness: 0.7,
        metalness: 0,
        side: DoubleSide,
        envMap: bg1Env,
        envMapIntensity: 0.8,
      }),
    [textures, bg1Env]
  )
}
