import { Request, Response } from 'express'

export default new class CreateProduct {
  public notRequiresAuth = true

  public async get(req: Request, res: Response){
    return res.status(200).json({
      message: 'Hello World'
    })
  }
}
