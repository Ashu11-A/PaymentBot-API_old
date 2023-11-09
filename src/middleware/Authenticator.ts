import { NextFunction, Request, Response } from 'express'
import { prisma } from '../services'
import jwt from 'jsonwebtoken'

export async function Authenticator () {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization
      if (!token) throw new Error('⚠️ Nenhum token fornecido!')

      const payload = jwt.verify(token, process.env.SECRET_KEY, { algorithms: ['HS256'] }) as jwt.JwtPayload
      if (!payload) throw new Error('🚫 Não autorizado!')

      const { uuid } = payload

      const existUser = await prisma.user.findFirst({ where: { uuid }})
      if (!existUser) throw new Error('🚫 Não autorizado!')

      req.accessToken = payload

      next()
    } catch (err) {
      next(err)
    }
  }
}
