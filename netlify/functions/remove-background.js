/**
 * Serverless background-removal proxy (Netlify Function).
 *
 * SECURITY: runs on the server; REMOVE_BG_API_KEY is a server env var and is
 * never exposed to the browser.
 *
 * Frontend calls:  POST /api/remove-background   (multipart/form-data, field "image")
 * → BackgroundRemoval API → returns image/png with transparency.
 *
 * Deploy: set REMOVE_BG_API_KEY in Netlify environment variables.
 */
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const apiKey = process.env.REMOVE_BG_API_KEY
  if (!apiKey) {
    return { statusCode: 503, body: JSON.stringify({ error: 'REMOVE_BG_API_KEY not configured' }) }
  }

  const contentType = event.headers['content-type'] || 'application/json'

  let bodyInput = event.body || ''
  if (event.isBase64Encoded) {
    bodyInput = Buffer.from(bodyInput, 'base64')
  }

  // Size guard — reject anything over 10 MB
  if (Buffer.byteLength(bodyInput, 'utf8') > 10 * 1024 * 1024) {
    return { statusCode: 413, body: JSON.stringify({ error: 'Image too large' }) }
  }

  try {
    // This example forwards to remove.bg in "stream" form.
    const fd = new FormData()
    if (Buffer.isBuffer(bodyInput)) {
      fd.append('image', new Blob([bodyInput], { type: 'image/png' }), 'profile.png')
    } else {
      const { message } = JSON.parse(event.body || '{}')
      if (message?.dataUrl) {
        // Accept a dataUrl JSON payload: { image: { dataUrl } }
        const dataUrl = message.dataUrl.split(',')[1]
        const buf = Buffer.from(dataUrl, 'base64')
        fd.append('image', new Blob([buf], { type: 'image/png' }), 'profile.png')
      } else {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing image' }) }
      }
    }

    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body: fd,
    })

    if (!res.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Background removal service error' }) }
    }

    const arrayBuffer = await res.arrayBuffer()
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
      body: Buffer.from(arrayBuffer).toString('base64'),
      isBase64Encoded: true,
    }
  } catch (error) {
    console.error('Background removal proxy error', error)
    return { statusCode: 502, body: JSON.stringify({ error: 'Proxy failed' }) }
  }
}