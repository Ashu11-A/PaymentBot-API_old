import { Request, Response } from 'express'
import { prisma } from '../../../services'

export default new class FindCategory {
  public async get(req: Request, res: Response){
    const { id } = req.params

    const product = await prisma.category.findFirst({
      where: {
        id
      },
      include: {
        ProductCategory: true
      }
    })

    return res.status(200).json(product)
  }
}
