import { Request, Response } from 'express'

export default function Errors() {
  return (err: Error, req: Request, res: Response) => {
    console.error(err.stack)

    if (req.xhr) return res.status(500).json({ error: true, message: 'Something failed!' })
    if (res.headersSent) return res.status(500).json({ error: true, message: err.message })
  }
}
