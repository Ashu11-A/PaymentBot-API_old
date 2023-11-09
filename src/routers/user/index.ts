import { Response, Request, NextFunction } from 'express'
import { prisma } from '../../services'
import * as yup from 'yup'

export default new class findUser {
  public validation (req: Request, res: Response, next: NextFunction) {
    try {
      const schema = yup.object({
        uuid: yup.string().required()
      })

      schema.validateSync(req.accessToken)
      next()
    } catch (err) {
      next(err)
    }
  }
  public async get(req: Request, res: Response, next: NextFunction){
    try {
      const { uuid } = req.accessToken
      if (!uuid) throw new Error('❌ uuid não informado.')

      const user = await prisma.user.findUnique({ where: { uuid }, include: { permission: true } })
      if (!user) throw new Error('❌ Usuário não encontrado!')

      const { name, email, permission,  created_at, updated_at } = user

      return res.status(200).json({
        name,
        email,
        created_at,
        updated_at,
        permission
      })
    }catch(err) {
      next(err)
    }
  }
}
