import { Response, Request, NextFunction } from 'express'
import { prisma } from '../../services'

export default new class findUser {
  public requereLevel = 5

  public async get(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params
      if (!id) throw new Error('❌ Id não informado.')

      const user = await prisma.user.findUnique({ where: { id: Number(id) }, include: { permission: true } })
      if (!user) throw new Error('❌ Usuário não encontrado!')

      return res.status(200).json(user)
    }catch(err) {
      next(err)
    }
  }
}
