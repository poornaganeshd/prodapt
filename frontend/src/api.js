const BASE = '/api/presentations'

async function handle(response) {
  let body = null
  try {
    body = await response.json()
  } catch {
    body = null
  }
  if (!response.ok) {
    const message =
      (body && body.error) || 'Something went wrong. Please try again.'
    throw new Error(message)
  }
  return body
}

export async function generatePresentation(text) {
  const response = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  return handle(response)
}

export async function listPresentations() {
  const response = await fetch(BASE)
  return handle(response)
}

export async function getPresentation(id) {
  const response = await fetch(`${BASE}/${id}`)
  return handle(response)
}
