import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch {
      // Le dossier existe déjà
    }

    // Générer un nom de fichier unique avec le nom original
    const timestamp = Date.now()
    const originalName = file.name
    const extension = path.extname(originalName)
    const baseName = path.basename(originalName, extension)
    
    // Remplacer les caractères problématiques dans le nom
    const safeBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_')
    const fileName = `${timestamp}_${safeBaseName}${extension}`
    
    // Chemin complet du fichier
    const filePath = path.join(uploadsDir, fileName)
    
    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Retourner l'URL publique
    const publicUrl = `/uploads/${fileName}`
    
    console.log('✅ Image uploadée:', publicUrl)
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName
    })

  } catch (error) {
    console.error('❌ Erreur upload:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de l\'image' },
      { status: 500 }
    )
  }
}
