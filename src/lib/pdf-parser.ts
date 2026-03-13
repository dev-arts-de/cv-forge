export async function parsePDFBuffer(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid issues with Next.js server-side rendering
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // Import from lib directly to skip pdf-parse's test-file initialization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfModule = await import('pdf-parse/lib/pdf-parse.js') as any
    const pdfParse = pdfModule.default ?? pdfModule
    const data = await pdfParse(buffer)
    return data.text
  } catch (error) {
    console.error('PDF parsing error:', error)
    throw new Error('Failed to parse PDF file. Please try pasting the text instead.')
  }
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['application/pdf', 'text/plain']

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'file_too_large' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'invalid_type' }
  }

  return { valid: true }
}
