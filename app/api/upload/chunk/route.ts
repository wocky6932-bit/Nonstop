import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'

export const dynamic = 'force-dynamic'

async function ensureMediaTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS uploaded_media (
      id VARCHAR(255) PRIMARY KEY,
      mime_type VARCHAR(100) NOT NULL,
      file_name VARCHAR(255),
      size_bytes BIGINT,
      data LONGBLOB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function POST(request: NextRequest) {
  try {
    await ensureMediaTable()
    const body = await request.json()
    const { action, uploadId, fileName, mimeType, totalSize, chunkData } = body

    if (action === 'init') {
      const id = `media_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      await query(
        `INSERT INTO uploaded_media (id, mime_type, file_name, size_bytes, data)
         VALUES (?, ?, ?, ?, '')`,
        [id, mimeType || 'video/mp4', fileName || 'video.mp4', totalSize || 0]
      )

      return NextResponse.json({ success: true, uploadId: id })
    }

    if (action === 'append') {
      if (!uploadId || !chunkData) {
        return NextResponse.json({ error: 'Données de chunk manquantes' }, { status: 400 })
      }

      const chunkBuffer = Buffer.from(chunkData, 'base64')

      // CONCAT binary buffer dans MySQL
      await query(
        `UPDATE uploaded_media
         SET data = CONCAT(IFNULL(data, ''), ?)
         WHERE id = ?`,
        [chunkBuffer, uploadId]
      )

      return NextResponse.json({ success: true })
    }

    if (action === 'finalize') {
      if (!uploadId) {
        return NextResponse.json({ error: 'uploadId manquant' }, { status: 400 })
      }

      // Calculer la taille finale réelle
      await query(
        `UPDATE uploaded_media
         SET size_bytes = OCTET_LENGTH(data)
         WHERE id = ?`,
        [uploadId]
      )

      const publicUrl = `/api/media/${uploadId}`

      return NextResponse.json({
        success: true,
        url: publicUrl,
        uploadId
      })
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
  } catch (error: any) {
    console.error('Erreur chunk upload:', error)
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de l\'upload par morceaux' },
      { status: 500 }
    )
  }
}
