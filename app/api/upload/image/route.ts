import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 })
    }

    // Convertir l'image en Base64
    // Sur Vercel (Serverless), nous ne pouvons pas écrire dans /public/uploads 
    // car le système de fichiers est en lecture seule ("Read-Only File System").
    // La solution est de stocker l'image directement en Base64 dans la base de données.
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Créer le Data URI (Base64)
    const base64Data = buffer.toString('base64')
    const mimeType = file.type || 'image/jpeg'
    const publicUrl = `data:${mimeType};base64,${base64Data}`
    
    console.log('✅ Image convertie en Base64 (taille:', Math.round(base64Data.length / 1024), 'KB)')
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: file.name
    })

  } catch (error) {
    console.error('❌ Erreur conversion image:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement de l\'image' },
      { status: 500 }
    )
  }
}
