import { Request, Response } from 'express'
import { prisma } from '../../services'

export default new class updateUser {


  public async post(req: Request, res: Response){
    try {
      const { id } = req.body
      const user = await prisma.user.findUnique({ where: { id } })

      if (!user) throw new Error('❌ Usuário não encontrado.')

      await prisma.user.delete({
        where: { id }
      }).then(() => {
        return res.status(200).json({
          error: false,
          message: '✅ Usuário deletado.'
        })
      })
    }catch(err) {
      return res.status(500).json({
        message: err.message
      })
    }
  }
}
