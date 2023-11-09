import { type Request, type Response, type NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../../services'
import jwt from 'jsonwebtoken'
import * as yup from 'yup'

export default new class createUser {
  public notRequiresAuth = true
  public notRequiredCors = true

  public validation (req: Request, res: Response, next: NextFunction) {
    try {
      const schema = yup.object({
        email: yup.string().required().email(),
        password: yup.string().required().min(6)
      })

      schema.validateSync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }

  public async post(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const user = await prisma.user.findUnique({ where: { email }})
      if (!user) throw new Error('❌ E-mail ou Senha incorretos.')

      const passwordVerify = await bcrypt.compare(password, user.password)
      if (!passwordVerify) throw new Error('❌ E-mail ou Senha incorretos.')

      const expiration = Math.floor(Date.now() / 1000) + 60 * 60
      const token = jwt.sign({ uuid: user.uuid, expiration }, process.env.SECRET_KEY, { algorithm: 'HS256' })

      return res.status(201).json(token)
    } catch(err) {
      next(err)
    }
  }
}
