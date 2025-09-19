export const getWsBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_WS_BASE_URL) {
    return process.env.NEXT_PUBLIC_WS_BASE_URL.replace(/\/$/, '')
  }
  const httpBase = process.env.NEXT_PUBLIC_API_BASE_URL
  if (httpBase && /^https?:\/\//.test(httpBase)) {
    const wsBase = httpBase.replace(/^http/, 'ws')
    return wsBase.replace(/\/$/, '')
  }
  // dev default
  return 'ws://localhost:8000'
}

export const buildWsUrl = (path: string): string => {
  const base = getWsBaseUrl()
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
