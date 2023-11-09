import { Request, Response } from 'express'

export default new class CreateProduct {
  public notRequiresAuth = true
  public notRequiredCors = true

  public async get(req: Request, res: Response){
    const ipAddress = req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? req.headers.ip ?? req.ip

    return res.status(200).json({
      youIp: ipAddress,
      path: req.path,
      message: 'Hello World'
    })
  }
}
