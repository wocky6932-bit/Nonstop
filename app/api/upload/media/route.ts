import { NextRequest, NextResponse } from 'next/server'

// Limite max pour vidéo uploadée en base64 directement (environ 25MB)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '30mb',
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier que c'est une vidéo ou une image
    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: 'Le fichier doit être une vidéo (MP4, WebM, MOV) ou une image' },
        { status: 400 }
      )
    }

    // Limiter la taille max à 25MB pour garantir fluidité et chargement rapide
    const MAX_SIZE = 25 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'La vidéo est trop volumineuse. Veuillez choisir une vidéo de moins de 25 Mo pour un chargement rapide.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const base64Data = buffer.toString('base64')
    const mimeType = file.type || (isVideo ? 'video/mp4' : 'image/jpeg')
    const publicUrl = `data:${mimeType};base64,${base64Data}`

    console.log(`✅ Fichier média converti (${isVideo ? 'Vidéo' : 'Image'}, taille: ${Math.round(base64Data.length / 1024)} KB)`)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      mediaType: isVideo ? 'video' : 'image',
      fileName: file.name
    })
  } catch (error) {
    console.error('❌ Erreur conversion média vidéo/image:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement du fichier vidéo' },
      { status: 500 }
    )
  }
}
