import { Request, Response } from 'express'
import { prisma } from '../../../services'

export default new class CreateCategory {
  public requereLevel = 5

  public async post(req: Request, res: Response) {
    const { name } = req.body

    const category = await prisma.category.create({
      data: {
        name
      }
    })

    return res.status(200).json(category)
  }
}
