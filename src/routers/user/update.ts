import { NextFunction, Request, Response } from 'express'
import { prisma } from '../../services'
import * as yup from 'yup'
import bcrypt from 'bcrypt'

export default new class updateUser {

  public validation (req: Request, res: Response, next: NextFunction) {
    try {
      const schemaUser = yup.object({
        id: yup.number().required(),
      })
      const schemaBody = yup.object({
        name: yup.string().required(),
        password: yup.string().required().min(6)
      })

      schemaUser.validateSync(req.user)
      schemaBody.validateSync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }

  public async patch(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.user
      const { name, password } = req.body
      const confirmData = await prisma.user.findUnique({ where: { id } })

      if (!confirmData) throw new Error('❌ Informações invalidas!')
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(password, salt)

      const user = await prisma.user.update({
        where: { id },
        data: { name, password: passwordHash }
      })

      if (user) {
        return res.status(200).json({
          error: false,
          message: '✅ Usuário atualizado',
        })
      }

    }catch(err) {
      next(err)
    }
  }
}
