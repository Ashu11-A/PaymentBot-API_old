import { Request, Response } from 'express'
import { prisma } from '../../../services'

export default class createPermissions {
  public requereLevel = 5

  public async post (req: Request, res: Response) {
    const { name, level } = req.body

    if (!name || !level) throw new Error('Argumentos ausentes')

    const permission = await prisma.permission.create({
      data: {
        name,
        level
      }
    })
    if (!permission) throw new Error('Houve um erro ao tentar criar uma permissão')

    res.status(200).json(permission)
  }
}
