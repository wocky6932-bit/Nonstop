// Utilitaire pour uploader des médias (images et vidéos volumineuses)
// sans jamais dépasser la limite Vercel Serverless (4.5MB) grâce au découpage en morceaux (chunks).

export async function uploadMediaFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string; mediaType: 'image' | 'video' }> {
  const isVideo = file.type.startsWith('video/')
  const isImage = file.type.startsWith('image/')
  const mediaType: 'image' | 'video' = isVideo ? 'video' : 'image'

  // Découpage en morceaux de 1.5 Mo (bien en-dessous de la limite Vercel de 4.5 Mo)
  const CHUNK_SIZE = 1.5 * 1024 * 1024
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

  // 1. Initialiser la session d'upload
  const initRes = await fetch('/api/upload/chunk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'init',
      fileName: file.name,
      mimeType: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
      totalSize: file.size
    })
  })

  if (!initRes.ok) {
    const errData = await initRes.json().catch(() => ({}))
    throw new Error(errData.error || "Impossible d'initialiser le téléchargement.")
  }

  const { uploadId } = await initRes.json()

  // 2. Envoyer chaque chunk converti en base64
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunkBlob = file.slice(start, end)

    // Convertir le chunk Blob en base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1] || ''
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(chunkBlob)
    })

    const appendRes = await fetch('/api/upload/chunk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'append',
        uploadId,
        chunkData: base64Data
      })
    })

    if (!appendRes.ok) {
      throw new Error(`Échec du transfert du morceau ${i + 1}/${totalChunks}`)
    }

    if (onProgress) {
      const pct = Math.round(((i + 1) / totalChunks) * 100)
      onProgress(pct)
    }
  }

  // 3. Finaliser l'upload
  const finalRes = await fetch('/api/upload/chunk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'finalize',
      uploadId
    })
  })

  if (!finalRes.ok) {
    throw new Error("Impossible de finaliser l'upload du fichier.")
  }

  const finalData = await finalRes.json()
  return {
    url: finalData.url,
    mediaType
  }
}
