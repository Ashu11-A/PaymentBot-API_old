import { NextFunction, Request, Response } from 'express'
import { prisma } from '../../../services'
import * as yup from 'yup'

export default new class CreateProduct {
  public requereLevel = 5

  public validation (req: Request, res: Response, next: NextFunction) {
    try {
      const schema = yup.object({
        name: yup.string().required().min(4),
        description: yup.string(),
        price:  yup.string().required()
      })

      schema.validateSync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }

  public async post(req: Request, res: Response, next: NextFunction){
    try {
      const { name, description, price } = req.body

      const product = await prisma.product.create({
        data: {
          name,
          price,
          description
        }
      })

      return res.status(201).json(product)
    } catch (err) {
      next(err)
    }
  }
}
