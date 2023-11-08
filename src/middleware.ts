import { type Request, type Response, type NextFunction } from 'express'
import settings from './settings/settings.json'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { prisma } from './services'
import Decimal from 'decimal.js'
import bcrypt from 'bcrypt'

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

export async function Auth (req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization
    if (!token) throw new Error('⚠️ Nenhum token fornecido!')

    const payload = jwt.verify(token, process.env.SECRET_KEY, { algorithms: ['HS256'] }) as jwt.JwtPayload
    if (!payload) throw new Error('🚫 Não autorizado!')

    const { id, name, email, password } = payload
    const existUser = await prisma.user.findFirst({ where: { id, name, email }})
    if (!existUser) throw new Error('🚫 Não autorizado!')

    const passwordVerify = await bcrypt.compare(password, existUser.password)
    if (!passwordVerify) throw new Error('🚫 Token Invalido!')

    req.user = payload

    next()
  } catch (err) {
    next(err)
  }
}

export async function Permission (requereLevel: number) {
  return async function (req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.user
      if (!id) throw new Error('❌ User não informado!')

      const { permission } = await prisma.user.findFirst({ where: { id }, include: { permission: true }})
      if (permission.level < new Decimal(requereLevel)) throw new Error('🚫 Sem Permição!')

      next()
    } catch (err) {
      next(err)
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

export function LoggingErrors (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack)
  next(err)
}

export function clientErrorHandler (err: Error, req: Request, res: Response, next: NextFunction) {
  if (req.xhr) {
    res.status(500).json({ error: true, message: 'Something failed!' })
  } else {
    next(err)
  }
}

export function errorHandler (err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.json({ error: true, message: err.message })
}
