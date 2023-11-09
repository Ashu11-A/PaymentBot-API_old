import { NextFunction, Request, Response } from 'express'
import { prisma } from '../../../services'
import * as yup from 'yup'

export default class createPermissions {
  public requereLevel = 5

  public validation (req: Request, res: Response, next: NextFunction) {
    try {
      const schema = yup.object({
        id: yup.string().required(),
      })

      schema.validateSync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }

  public async post (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body

      if (!id) throw new Error('Argumentos ausentes')

      const permission = await prisma.permission.delete({where: { id }})
      if (!permission) throw new Error('Houve um erro ao tentar criar uma permissão')

      res.status(201).json(permission)
    } catch (err) {
      next(err)
    }
  }
}
