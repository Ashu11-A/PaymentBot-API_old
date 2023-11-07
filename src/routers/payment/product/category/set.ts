import { Request, Response } from 'express'
import { prisma } from '../../../../services'

export default class CreateProductCategory {


  public async post (req: Request, res: Response){
    const { idProduct, idCategory } = req.body

    const productCategory = await prisma.productCategory.create({
      data: {
        idCategory,
        idProduct
      }
    })

    return res.status(200).json(productCategory)
  }
}
