import { NextFunction, Request, Response } from 'express'
import { prisma } from '../../services'

export default new class updateUser {

  public async delete(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.user
      console.log(req.user)
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
      next(err)
    }
  }
}
