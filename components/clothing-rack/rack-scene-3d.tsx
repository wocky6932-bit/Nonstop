'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

interface RackSceneProps {
  activeIndex: number
  onSelectGarment: (index: number) => void
}

/**
 * SCÈNE 3D NONSTOPP STUDIO — IMAGE-TO-3D VOLUMÉTRIQUE
 * Chaque vêtement 3D est reconstruit directement à partir de la véritable photo du produit :
 * - Relief volumétrique 3D complet (torse bombé, épaisseur de tissu réelle, effilement des manches et des bords)
 * - Texture originale haute définition plaquée à 100% de fidélité
 * - Suspension sur cintres en bois massif le long de la barre chromée
 */
export function RackScene({ activeIndex, onSelectGarment }: RackSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // 1. SCÈNE, CAMÉRA & MOTEUR WEBGL
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf6f4ef) // Ambiance studio minimaliste NONSTOPP

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100)
    camera.position.set(0, 0.20, 3.7)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    container.appendChild(renderer.domElement)

    // 2. ÉCLAIRAGE DE STUDIO RÉALISTE
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.6)
    keyLight.position.set(2.5, 3.8, 3.2)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    keyLight.shadow.camera.near = 0.5
    keyLight.shadow.camera.far = 10
    keyLight.shadow.camera.left = -3
    keyLight.shadow.camera.right = 3
    keyLight.shadow.camera.top = 2
    keyLight.shadow.camera.bottom = -2
    keyLight.shadow.bias = -0.0002
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xedf2f7, 0.85)
    fillLight.position.set(-2.8, 1.8, 2.2)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.75)
    rimLight.position.set(0, 3.0, -2.4)
    scene.add(rimLight)

    // 3. BARRE MÉTALLIQUE CHROMÉE DU PORTANT
    const railGroup = new THREE.Group()

    const railGeo = new THREE.CylinderGeometry(0.024, 0.024, 5.4, 32)
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      metalness: 0.95,
      roughness: 0.12,
    })
    const railMesh = new THREE.Mesh(railGeo, chromeMat)
    railMesh.rotation.z = Math.PI / 2
    railMesh.position.y = 0.96
    railMesh.castShadow = true
    railGroup.add(railMesh)

    // Fixations murales latérales
    const bracketMat = new THREE.MeshStandardMaterial({
      color: 0x181a1e,
      metalness: 0.85,
      roughness: 0.25,
    })
    const leftBracket = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.12, 0.12), bracketMat)
    leftBracket.position.set(-2.7, 0.96, 0)
    railGroup.add(leftBracket)

    const rightBracket = leftBracket.clone()
    rightBracket.position.set(2.7, 0.96, 0)
    railGroup.add(rightBracket)

    scene.add(railGroup)

    // 4. OMBRE AU SOL STUDIO ESTOMPÉE
    const shadowGeo = new THREE.PlaneGeometry(8, 4)
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.09 })
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
    shadowMesh.rotation.x = -Math.PI / 2
    shadowMesh.position.y = -1.15
    shadowMesh.receiveShadow = true
    scene.add(shadowMesh)

    // 5. CINTRES EN BOIS PROFILÉ
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x241d18,
      roughness: 0.35,
      metalness: 0.05,
    })

    const hangerShape = new THREE.Shape()
    hangerShape.moveTo(-0.36, -0.07)
    hangerShape.lineTo(0, 0.07)
    hangerShape.lineTo(0.36, -0.07)
    hangerShape.lineTo(0.34, -0.10)
    hangerShape.lineTo(0, 0.035)
    hangerShape.lineTo(-0.34, -0.10)
    hangerShape.closePath()

    const hangerGeo = new THREE.ExtrudeGeometry(hangerShape, {
      depth: 0.022,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.005,
      bevelThickness: 0.005,
    })

    // 6. PRODUITS RÉELS DU CATALOGUE AVEC VRAIS MODÈLES 3D RECONSTRUITS
    const textureLoader = new THREE.TextureLoader()
    const objLoader = new OBJLoader()

    const productsConfig = [
      {
        id: '1792616909279',
        name: 'Tee shirt tartan',
        modelUrl: '/models/tee-tartan-3d.obj',
        textureUrl: '/rack-test/tee-black-tartan.png',
        yOffset: 0.44,
        roughness: 0.88,
      },
      {
        id: '1786383165433',
        name: 'Longue sleeves 2004',
        modelUrl: '/models/longsleeve-2004-3d.obj',
        textureUrl: '/rack-test/longsleeve-2004.png',
        yOffset: 0.46,
        roughness: 0.82,
      },
      {
        id: '1783729610841',
        name: 'T-shirt Classic White',
        modelUrl: '/models/tee-white-3d.obj',
        textureUrl: '/rack-test/tee-white-nonstop.png',
        yOffset: 0.44,
        roughness: 0.84,
      },
      {
        id: '1792639100833',
        name: 'Tee shirt tartan — Studio',
        modelUrl: '/models/tee-tartan-3d.obj',
        textureUrl: '/rack-test/tee-black-tartan.png',
        yOffset: 0.44,
        roughness: 0.88,
      },
      {
        id: '1791674451992',
        name: 'Longue sleeves Noir',
        modelUrl: '/models/longsleeve-2004-3d.obj',
        textureUrl: '/rack-test/longsleeve-2004.png',
        yOffset: 0.46,
        roughness: 0.86,
      },
    ]

    const garmentGroups: THREE.Group[] = []
    const spacing = 0.94
    const startX = -((productsConfig.length - 1) * spacing) / 2

    productsConfig.forEach((product, idx) => {
      const itemGroup = new THREE.Group()
      itemGroup.position.set(startX + idx * spacing, 0, 0)

      // A. Crochet en métal chromé reposant exactement sur le rail (y = 0.96)
      const hookGeo = new THREE.TorusGeometry(0.040, 0.0055, 16, 32, Math.PI * 1.35)
      const hookMesh = new THREE.Mesh(hookGeo, chromeMat)
      hookMesh.position.set(0, 0.998, 0)
      hookMesh.rotation.y = Math.PI / 2
      itemGroup.add(hookMesh)

      // Tige reliant le crochet au cintre
      const stemGeo = new THREE.CylinderGeometry(0.0045, 0.0045, 0.08, 16)
      const stemMesh = new THREE.Mesh(stemGeo, chromeMat)
      stemMesh.position.set(0, 0.935, 0)
      itemGroup.add(stemMesh)

      // B. Cintre en bois massif
      const hangerMesh = new THREE.Mesh(hangerGeo, woodMat)
      hangerMesh.position.set(0, 0.88, -0.011)
      hangerMesh.castShadow = true
      hangerMesh.userData = { index: idx }
      itemGroup.add(hangerMesh)

      // C. Chargement du véritable modèle volumétrique 3D reconstruit depuis la photo
      const texture = textureLoader.load(product.textureUrl, () => {
        renderer.render(scene, camera)
      })
      texture.colorSpace = THREE.SRGBColorSpace

      objLoader.load(product.modelUrl, (loadedObj) => {
        loadedObj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            mesh.material = new THREE.MeshStandardMaterial({
              map: texture,
              roughness: product.roughness,
              metalness: 0.04,
              side: THREE.DoubleSide,
            })
            mesh.castShadow = true
            mesh.receiveShadow = true
            mesh.userData = { index: idx }
          }
        })

        loadedObj.position.set(0, product.yOffset, 0)
        itemGroup.add(loadedObj)
        renderer.render(scene, camera)
      })

      scene.add(itemGroup)
      garmentGroups.push(itemGroup)
    })

    // 7. GESTION DES CLICS & SÉLECTIONS
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const handlePointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(scene.children, true)

      for (const hit of hits) {
        if (hit.object.userData && typeof hit.object.userData.index === 'number') {
          onSelectGarment(hit.object.userData.index)
          break
        }
      }
    }

    renderer.domElement.addEventListener('pointerdown', handlePointerDown)

    // 8. ANIMATION FLUIDE & BALANCEMENT SUBTIL
    let frameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      const time = clock.getElapsedTime()

      garmentGroups.forEach((group, idx) => {
        const isSelected = idx === activeIndex

        // Avance vers la caméra pour le vêtement sélectionné
        const targetZ = isSelected ? 0.32 : 0
        const targetScale = isSelected ? 1.05 : 0.96

        group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, 0.1)
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

        // Balancement doux physique de portant streetwear
        const sway = Math.sin(time * 1.4 + idx * 0.8) * 0.014
        group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, sway, 0.05)
      })

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }

    animate()

    // 9. RESPONSIVE
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [activeIndex, onSelectGarment])

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[520px] sm:h-[600px] cursor-pointer outline-none select-none"
    />
  )
}
