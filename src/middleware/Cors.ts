import { type Request, type Response, type NextFunction } from 'express'
import settings from '../settings/settings.json'
import cors from 'cors'
import { SetAlowedRoutes } from '../controllers/AllowedRoutes'


export default function Cors () {
  return (req: Request, res: Response, next: NextFunction) => {
    const { cors, protocol, ip, port } = settings.express
    const { active } = cors
    let { allow } = cors

    if (active) {
      cors<Request>({
        origin (requestOrigin, callback) {
          if (typeof allow === 'undefined') allow = ['']
          allow.push(`${ip}:${port}`)

          const origin = requestOrigin
            ? requestOrigin
            : req.headers.host
              ? SetAlowedRoutes(req.headers.host, protocol, String(port))
              : undefined
          const allowedOrigins = SetAlowedRoutes(
            allow,
            protocol,
            port,
          )

          if (typeof origin === 'string' && (Boolean(allow.includes(origin)))) {
            callback(null, true)
          } else if (Array.isArray(origin)) {
            let found = false

            for (const originItem of origin) {
              if (typeof originItem === 'string' && (Boolean(allow.includes(originItem)))) {
                callback(null, true)
                found = true
                return
              }
            }

            if (!found) {
              callback(new Error('Acesso não autorizado devido à política CORS.'), false)
            }
          } else {
            callback(new Error('Acesso não autorizado devido à política CORS.'), false)
          }
        },
        optionsSuccessStatus: 200,
        credentials: true
      })(req, res, (err) => {
        const ipAddress: string | string[] | undefined = req.headers['x-forwarded-for'] ?? req.socket.remoteAddress

        if (err !== undefined) {
          console.log(`Bloqueado: ${req.originalUrl} - IP: ${ipAddress?.toString()}`)
          return res.status(403).json({ status: 403, message: 'Operação não permitida' })
        } else {
          next()
        }
      })
    } else {
      next()
    }
  }
}
