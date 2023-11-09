import { NextFunction, Request, Response } from 'express'
import { prisma } from '../../../services'
import * as yup from 'yup'

export default new class CreateCategory {
  public requereLevel = 5

  public validation (req: Request, res: Response, next: NextFunction) {
    try {
      const schema = yup.object({
        name: yup.string().required(),
      })

      schema.validateSync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }

  public async post(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body

      const category = await prisma.category.create({
        data: {
          name
        }
      })

      return res.status(201).json(category)
    } catch (err) {
      next(err)
    }
  }
}
