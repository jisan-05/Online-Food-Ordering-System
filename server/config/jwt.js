export function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim()

  if (!secret) {
    throw new Error('JWT_SECRET is missing from environment variables')
  }

  return secret
}

export function getJwtExpiresIn() {
  return (process.env.JWT_EXPIRES_IN || '7d').trim()
}
