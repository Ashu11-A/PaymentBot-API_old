import { Request, Response } from 'express'
import { prisma } from '../../services'

export default new class updateUser {


  public async post(req: Request, res: Response){
    try {
      const { id, name, password } = req.body
      const confirmData = await prisma.user.findUnique({ where: { id } })

      if (!confirmData) {
        return res.status(409).json({
          error: true,
          message: 'Erro: Informações invalidas!'
        })
      }

      const user = await prisma.user.update({
        where: { id },
        data: { name, password }
      })

      if (user) {
        return res.status(200).json({
          error: false,
          message: 'Sucesso: Usuário atualizado',
          user
        })
      }

    }catch(err) {
      return res.status(500).json({
        message: err.message
      })
    }
  }
}
