import { Response } from 'express'
import { prisma } from '../../services'
import { RequestWithUser } from '../../middleware'

export default new class findUser {
  public requereLevel = 5

  public async post(req: RequestWithUser, res: Response){
    try {
      const { id } = req.params

      if (!id) throw new Error('❌ Email não informado.')

      const user = await prisma.user.findUnique({ where: { id: Number(id) }, include: { permission: true } })

      if (!user) throw new Error('❌ Usuário não encontrado!')

      return res.status(200).json(user)
    }catch(err) {
      return res.status(500).json({
        message: err.message
      })
    }
  }
}
