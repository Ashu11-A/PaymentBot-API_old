import { NextFunction, Request, Response } from 'express'
import { prisma } from '../../services'

export default new class updateUser {

  public async delete(req: Request, res: Response, next: NextFunction){
    try {
      const { uuid } = req.accessToken

      const user = await prisma.user.findUnique({ where: { uuid } })
      if (!user) throw new Error('❌ Usuário não encontrado.')

      await prisma.user.delete({
        where: { uuid }
      }).then(() => {
        return res.status(200).json({
          error: false,
          message: '✅ Usuário deletado.'
        })
      })
    }catch(err) {
      next(err)
    }
  }
}
