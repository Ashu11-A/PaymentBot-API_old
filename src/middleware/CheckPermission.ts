import { NextFunction, Request, Response } from 'express'
import { prisma } from '../services'
import Decimal from 'decimal.js'


export default async function CheckPermission (requereLevel: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uuid } = req.accessToken
      if (!uuid) throw new Error('❌ User não informado!')

      const { permission } = await prisma.user.findFirst({ where: { uuid }, include: { permission: true }})
      if (permission.level < new Decimal(requereLevel)) throw new Error('🚫 Sem Permição!')

      next()
    } catch (err) {
      next(err)
    }
  }
}
