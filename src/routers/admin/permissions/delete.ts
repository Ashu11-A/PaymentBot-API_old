import { Request, Response } from 'express'
import { prisma } from '../../../services'

export default class createPermissions {
  public requereLevel = 5
  
  public async post (req: Request, res: Response) {
    const { id } = req.body

    if (!id) throw new Error('Argumentos ausentes')

    const permission = await prisma.permission.delete({where: { id }})
    if (!permission) throw new Error('Houve um erro ao tentar criar uma permissão')

    res.status(200).json(permission)
  }
}
