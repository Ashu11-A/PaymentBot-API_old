import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../../services'
import jwt from 'jsonwebtoken'
import userValidator from '../../validations/user.validation'

export default new class createUser {
  public notRequiresAuth = true

  public async post(req: Request, res: Response){
    try {
      await userValidator.login.validate(req.body)

      const { email, password } = req.body
      const user = await prisma.user.findUnique({ where: { email }})
      if (!user) throw new Error('❌ E-mail ou Senha incorretos.')

      const { id, name, password: passwordHash } = user
      const passwordVerify = await bcrypt.compare(password, passwordHash)
      if (!passwordVerify) throw new Error('❌ E-mail ou Senha incorretos.')

      const expiration = Math.floor(Date.now() / 1000) + 60 * 60
      const payload = {
        userId: id,
        userName: name,
        userEmail: email,
        expiration
      }
      const token = jwt.sign(payload, process.env.SECRET_KEY, { algorithm: 'HS256' })

      return res.status(200).json(token)
    }catch(err) {
      return res.status(400).json(err)
    }
  }
}
