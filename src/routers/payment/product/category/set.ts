import { NextFunction, Request, Response } from 'express'
import { prisma } from '../../../../services'
import * as yup from 'yup'

export default class CreateProductCategory {
  public requereLevel = 5

  public validation (req: Request, res: Response, next: NextFunction) {
    try {
      const schema = yup.object({
        idProduct: yup.string().required(),
        idCategory: yup.string().required()
      })

      schema.validateSync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }

  public async post (req: Request, res: Response, next: NextFunction){
    try {
      const { idProduct, idCategory } = req.body

      const productCategory = await prisma.productCategory.create({
        data: {
          idCategory,
          idProduct
        }
      })

      return res.status(201).json(productCategory)
    } catch (err) {
      next(err)
    }
  }
}
