import { Request, Response } from 'express'
import { prisma } from '../../../services'

export default new class FindProduct {


  public async get(req: Request, res: Response){
    const { id } = req.params

    const product = await prisma.product.findFirst({
      where: {
        id
      },
      include: {
        ProductCategory: {
          include: {
            category: true
          }
        }
      }
    })

    return res.status(200).json(product)
  }
}
