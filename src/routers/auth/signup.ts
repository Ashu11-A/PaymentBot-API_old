import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../../services'
import * as yup from 'yup'

export default new class createUser {
  public notRequiresAuth = true
  public notRequiredCors = true

  public validation (req: Request, res: Response, next: NextFunction) {
    try {
      const schema = yup.object({
        name: yup.string().required().min(4),
        email: yup.string().required().email(),
        password: yup.string().required().min(6)
      })

      schema.validateSync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }

  public async post(req: Request, res: Response, next: NextFunction){
    try {
      const { name, email, password } = req.body

      const userExist = await prisma.user.findUnique({ where: { email }})
      if (userExist) throw new Error('❌ Usuário já existe!')

      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(password, salt)
      const permission = await prisma.permission.upsert({
        where: { name: 'user' },
        update: {},
        create: {
          name: 'user',
          level: 0
        }
      })

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          idPermission: permission.id
        }
      })

      if (user) return res.status(201).json({
        status: 'completed',
        message: '✅ Usuário criado com sucesso'
      })
    } catch(err) {
      next(err)
    }
  }
}
