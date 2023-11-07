import { Request, Response } from 'express'
import { prisma } from '../../../services'

export default new class CreateProduct {


  public async post(req: Request, res: Response){
    const { name, description, price } = req.body

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description
      }
    })

    return res.status(200).json(product)
  }
}
