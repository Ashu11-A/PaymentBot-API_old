import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../../services'
import userValidator from '../../validations/user.validation'

export default new class createUser {
  public notRequiresAuth = true

  public async post(req: Request, res: Response){
    try {
      await userValidator.register.validate(req.body)
      const { name, email, password } = req.body

      const userExist = await prisma.user.findUnique({ where: { email }})
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(password, salt)

      if (userExist)  return res.status(409).json({
        error: true,
        message: 'Erro: Usuário já existe!'
      })

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

      const expiration = Math.floor(Date.now() / 1000) + 60 * 60
      const payload = {
        userId: user.id,
        userName: name,
        userEmail: email,
        expiration
      }
      const token = jwt.sign(payload, process.env.SECRET_KEY, { algorithm: 'HS256' })

      if (user) return res.status(200).json(token)
    }catch(err) {
      return res.status(400).json(err)
    }
  }
}
