/**
 * Serverless AI chat proxy (Netlify Function).
 *
 * SECURITY: This file runs on the server. Your AI_API_KEY is read from env
 * vars and is NEVER shipped to the browser.
 *
 * The frontend calls:  POST /api/chat   { message: "..." }
 * which Netlify redirects here (see netlify.toml).
 *
 * Deploy: set AI_API_KEY in Netlify → Site settings → Environment variables,
 * and point the site at a model via AI_PROVIDER + AI_MODEL.
 */
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const apiKey = process.env.AI_API_KEY
  const provider = process.env.AI_PROVIDER || 'openai'

  if (!apiKey) {
    return { statusCode: 503, body: JSON.stringify({ error: 'AI_API_KEY not configured' }) }
  }

  let message = ''
  try {
    message = JSON.parse(event.body || '{}').message || ''
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad request body' }) }
  }

  const base = {
    role: 'system',
    content: [
      'You are CodeVora/Jarvis, the AI assistant embedded in Roshan Kannaujiya\'s portfolio.',
      'Be friendly, concise and a little playful. Know: Roshan is an AI & ML student at',
      'GCRG Group of Institutions, Lucknow (B.Tech, expected 2028). Stack: Python, Java, C,',
      'C++, SQL, HTML, CSS, JavaScript, React, Next.js, NLP, Machine Learning, Firebase,',
      'Git/GitHub, Linux, REST APIs.',
    ].join(' '),
  }

  try {
    if (provider === 'openai' || provider === 'openai-compatible') {
      const baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1'
      const model = process.env.AI_MODEL || 'gpt-4o-mini'
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [base, { role: 'user', content: message.slice(0, 2000) }],
          max_tokens: 600,
        }),
      })
      const data = await res.json()
      const reply =
        data.choices?.[0]?.message?.content?.trim() ||
        'I could not reach the model right now.'
      return { statusCode: 200, body: JSON.stringify({ reply }) }
    }

    return { statusCode: 501, body: JSON.stringify({ error: `Unsupported provider: ${provider}` }) }
  } catch (error) {
    console.error('AI proxy error', error)
    return { statusCode: 502, body: JSON.stringify({ error: 'AI proxy failed' }) }
  }
}