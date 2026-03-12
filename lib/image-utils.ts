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

  // Nettoyer les espaces multiples et les espaces de début/fin
  const cleaned = imageUrl.trim().replace(/\s+/g, ' ')

  // Encoder les URLs pour gérer les caractères spéciaux
  try {
    // Si c'est déjà une URL absolue, s'assurer qu'elle est bien encodée
    if (cleaned.startsWith('http')) {
      // Éviter de ré-encoder si c'est déjà fait
      if (cleaned.includes('%')) return cleaned
      return encodeURI(cleaned)
    }

    // Pour les images locales /images/..., s'assurer du slash initial
    const finalPath = cleaned.startsWith('/') ? cleaned : `/${cleaned}`

    // Encoder les caractères spéciaux (notamment les espaces pour WhatsApp images)
    return encodeURI(finalPath).replace(/%20/g, ' ') // Next.js Image gère souvent mieux les espaces que l'encodage complet selon la config
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