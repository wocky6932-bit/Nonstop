/**
 * Utilitaires pour gérer les images avec des valeurs vides
 */

/**
 * Retourne une URL d'image valide ou un placeholder par défaut
 * @param imageUrl - URL de l'image (peut être vide, null ou undefined)
 * @param placeholder - URL du placeholder par défaut (optionnel)
 * @returns URL valide ou placeholder
 */
export function getValidImageUrl(
  imageUrl: string | null | undefined,
  placeholder: string = "/placeholder.svg"
): string {
  // Si l'URL est null, undefined, ou une chaîne vide/whitespace uniquement
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return placeholder
  }

  // Nettoyer uniquement les espaces de début/fin
  const cleaned = imageUrl.trim()

  // Encoder les URLs pour gérer les caractères spéciaux
  try {
    // Si c'est déjà une URL absolue, normaliser l'encodage
    if (cleaned.startsWith('http')) {
      try {
        return encodeURI(decodeURI(cleaned))
      } catch {
        return encodeURI(cleaned)
      }
    }

    // Pour les images locales /images/..., s'assurer du slash initial
    const finalPath = cleaned.startsWith('/') ? cleaned : `/${cleaned}`

    // Normaliser l'encodage (décode si déjà encodé, puis ré-encode proprement)
    try {
      return encodeURI(decodeURI(finalPath))
    } catch {
      return encodeURI(finalPath)
    }
  } catch {
    return cleaned
  }
}

/**
 * Vérifie si une URL d'image est valide (non vide)
 * @param imageUrl - URL de l'image
 * @returns true si l'URL est valide
 */
export function isValidImageUrl(imageUrl: string | null | undefined): boolean {
  return !!(imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '')
}