'use client'

import * as THREE from 'three'

/**
 * Générateur de géométrie 3D volumétrique de T-shirt
 * - Buste avec volume avant/arrière et courbure réaliste
 * - Manches courtes ou longues inclinées naturellement
 * - Col rond avec creux d'encolure s'insérant sur le cintre
 * - Coordonnées UV orthographiques pour projection textile nette
 */
export function createGarment3DGeometry(isLongSleeve: boolean = false): THREE.BufferGeometry {
  const shape = new THREE.Shape()

  // 1. Encolure / Col rond (creux naturel sur cintre)
  shape.moveTo(-0.13, 0.49)
  shape.quadraticCurveTo(0, 0.44, 0.13, 0.49)

  // 2. Épaule droite (pente naturelle douce)
  shape.lineTo(0.38, 0.42)

  if (isLongSleeve) {
    // Manches longues tombant élégamment
    shape.lineTo(0.54, 0.12)
    shape.lineTo(0.52, -0.32)
    shape.lineTo(0.42, -0.34)
    shape.lineTo(0.43, 0.05)
    shape.lineTo(0.36, 0.14)
  } else {
    // Manches courtes streetwear amples
    shape.lineTo(0.56, 0.22)
    shape.lineTo(0.46, 0.08)
    shape.lineTo(0.35, 0.15)
  }

  // 3. Côté droit du torse (coupe streetwear droite et fluide)
  shape.lineTo(0.36, -0.44)

  // 4. Ourlet du bas (légère courbe fluide)
  shape.quadraticCurveTo(0, -0.46, -0.36, -0.44)

  // 5. Côté gauche du torse
  shape.lineTo(-0.35, 0.15)

  if (isLongSleeve) {
    shape.lineTo(-0.43, 0.05)
    shape.lineTo(-0.42, -0.34)
    shape.lineTo(-0.52, -0.32)
    shape.lineTo(-0.54, 0.12)
  } else {
    shape.lineTo(-0.46, 0.08)
    shape.lineTo(-0.56, 0.22)
  }

  // 6. Épaule gauche
  shape.lineTo(-0.38, 0.42)

  shape.closePath()

  // Extrusion 3D volumétrique : épaisseur réelle du tissu et volume du torse
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.048,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 2,
    bevelSize: 0.012,
    bevelThickness: 0.012,
  }

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  geom.center()

  // Calcul des coordonnées UV orthographiques pour projection textile
  // et déformation volumétrique subtile (bombe le torse vers l'avant)
  const pos = geom.attributes.position
  const count = pos.count
  const uvs = new Float32Array(count * 2)

  const minX = isLongSleeve ? -0.58 : -0.56
  const maxX = isLongSleeve ? 0.58 : 0.56
  const minY = isLongSleeve ? -0.48 : -0.46
  const maxY = 0.50

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    let z = pos.getZ(i)

    // Courbure naturelle du torse : le centre du buste est légèrement bombé vers l'observateur
    const distFromCenter = Math.min(1.0, Math.abs(x) / 0.40)
    const bulge = 0.018 * Math.cos(distFromCenter * Math.PI * 0.5) * Math.cos((y / 0.5) * Math.PI * 0.4)
    pos.setZ(i, z + bulge)

    // UVs sur face avant (z > 0)
    if (z >= 0.01) {
      uvs[i * 2] = (x - minX) / (maxX - minX)
      uvs[i * 2 + 1] = (y - minY) / (maxY - minY)
    } else {
      // Dos et tranches : couleur neutre du tissu
      uvs[i * 2] = 0.02
      uvs[i * 2 + 1] = 0.02
    }
  }

  geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geom.computeVertexNormals()

  return geom
}
