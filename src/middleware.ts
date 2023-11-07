import { type Request, type Response, type NextFunction } from 'express'
import settings from './settings.json'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { prisma } from './services'
import Decimal from 'decimal.js'

export interface RequestWithUser extends Request {
    user?: jwt.JwtPayload
}

export function Cors (req: Request, res: Response, next: NextFunction): void {
  const { active } = settings.express.cors
  let { allow } = settings.express.cors

  if (active) {
    cors<Request>({
      origin (requestOrigin, callback) {
        if (allow === undefined) allow = ['']
        allow.push(`${settings.express.ip}:${settings.express.port}`)

        const origin = requestOrigin ?? req.headers.ip ?? req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? req.ip

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

export function Auth (req: RequestWithUser, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization
    if (!token) throw new Error('⚠️ Nenhum token fornecido!')

    const payload = jwt.verify(token, process.env.SECRET_KEY, { algorithms: ['HS256'] })
    if (!payload) throw new Error('🚫 Não autorizado!')

    req.user = payload as jwt.JwtPayload

    next()
  } catch (err) {
    res.status(401).json(err)
  }
}

export async function Permission (requereLevel: number) {
  return async function (req: RequestWithUser, res: Response, next: NextFunction){
    try {
      const { userId } = req.user
      if (!userId) throw new Error('❌ User não informado!')

      const { permission } = await prisma.user.findFirst({ where: { id: userId }, include: { permission: true }})
      if (permission.level < new Decimal(requereLevel)) throw new Error('🚫 Não autorizado!')

      next()
    } catch (err) {
      res.status(401).json(err)
    }
  }
}

export function Logging(req: Request, res: Response, next: NextFunction): void {
  const ipAddress: string | string[] | undefined = req.headers['x-forwarded-for'] ?? req.socket.remoteAddress

  // Registre o IP e a rota no console
  if (ipAddress !== undefined) {
    console.log(`Acesso à rota: ${req.originalUrl} - IP: ${ipAddress.toString()}`)
  }

  next()
}
