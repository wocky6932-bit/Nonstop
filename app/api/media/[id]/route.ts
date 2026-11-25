import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'

// S'assure que la table uploaded_media existe
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureMediaTable()
    const { id } = await params

    if (!id) {
      return new NextResponse('Media ID missing', { status: 400 })
    }

    // Récupérer les métadonnées (mime, taille)
    const metaRows = await query(
      'SELECT mime_type, file_name, size_bytes, OCTET_LENGTH(data) AS actual_size FROM uploaded_media WHERE id = ?',
      [id]
    ) as any[]

    if (!metaRows || metaRows.length === 0) {
      return new NextResponse('Media not found', { status: 404 })
    }

    const { mime_type, size_bytes, actual_size } = metaRows[0]
    const totalSize = Number(actual_size || size_bytes || 0)

    const range = request.headers.get('range')

    if (range) {
      // Support HTTP Byte-Ranges (essentiel pour streaming vidéo iPhone / Safari / Chrome)
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1

      if (start >= totalSize || start < 0) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            'Content-Range': `bytes */${totalSize}`,
          },
        })
      }

      const chunkSize = end - start + 1
      // MySQL SUBSTRING est 1-indexed
      const chunkRows = await query(
        'SELECT SUBSTRING(data, ?, ?) AS chunk FROM uploaded_media WHERE id = ?',
        [start + 1, chunkSize, id]
      ) as any[]

      const chunkBuffer = chunkRows[0]?.chunk || Buffer.alloc(0)

      return new NextResponse(chunkBuffer, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${totalSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunkSize),
          'Content-Type': mime_type || 'video/mp4',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // Requête complète sans range
    const fullRows = await query(
      'SELECT data FROM uploaded_media WHERE id = ?',
      [id]
    ) as any[]

    const dataBuffer = fullRows[0]?.data || Buffer.alloc(0)

    return new NextResponse(dataBuffer, {
      status: 200,
      headers: {
        'Accept-Ranges': 'bytes',
        'Content-Length': String(totalSize),
        'Content-Type': mime_type || 'video/mp4',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Erreur lecture media:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
