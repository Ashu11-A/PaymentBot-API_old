import { NextFunction, Request, Response } from 'express'
import { prisma } from '../../services'
import * as yup from 'yup'
import bcrypt from 'bcrypt'

export default new class updateUser {

  public validation (req: Request, res: Response, next: NextFunction) {
    try {
      const schemaUser = yup.object({
        uuid: yup.string().required(),
      })
      const schemaBody = yup.object({
        name: yup.string().min(4),
        password: yup.string().min(6)
      })

      schemaUser.validateSync(req.accessToken)
      schemaBody.validateSync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }

  public async patch(req: Request, res: Response, next: NextFunction){
    try {
      const { uuid } = req.accessToken
      const { name, password } = req.body

      const userData = await prisma.user.findUnique({ where: { uuid } })
      if (!userData) throw new Error('❌ Informações invalidas!')

      if (password && !await bcrypt.compare(password, userData.password)) {
        const salt = await bcrypt.genSalt(10)
        const newPassword = await bcrypt.hash(password, salt)

        await prisma.user.update({
          where: { uuid },
          data: { password: newPassword }
        })
      }

      await prisma.user.update({
        where: { uuid },
        data: { name }
      })

      return res.status(200).json({
        error: false,
        message: '✅ Usuário atualizado',
      })

    }catch(err) {
      next(err)
    }
  }
}
