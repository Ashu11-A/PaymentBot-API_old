/**
 * SetAlowedRoutes
 * @param allowed String das rotas permitidas
 * @param protocol protocolo usado
 * @returns array de rotas permitidas
 */
export function SetAlowedRoutes(allowed: string[], protocol: string, port: string): string[] {
  const allowedOrigins: string[] = []

  const protocols: string[] = []
  switch (protocol) {
  case 'http':
    protocols.push('http')
    break
  case 'https':
    protocols.push('https')
    break
  case 'http/https':
    protocols.push('http')
    protocols.push('https')
    break
  default:
    break
  }
  allowed.forEach((route) => {
    protocols.forEach((protocol) => {
      if (!route.startsWith('http://') && !route.startsWith('https://')) {
        allowedOrigins.push(`${protocol}://${route}:${port}`)
        allowedOrigins.push(`${protocol}://${route}`)
      } else {
        allowedOrigins.push(route)
      }
    })
  })
  return allowedOrigins
}
