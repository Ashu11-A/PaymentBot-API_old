import { NextFunction, Request, Response } from 'express'

export default function Logging() {
  return (req: Request, res: Response, next: NextFunction) => {
    const ipAddress: string | string[] | undefined = req.headers['x-forwarded-for'] ?? req.socket.remoteAddress

    // Registre o IP e a rota no console
    if (ipAddress !== undefined) {
      console.log(`Acesso à rota: ${req.originalUrl} - IP: ${ipAddress.toString()}`)
    }

    next()
  }
}
