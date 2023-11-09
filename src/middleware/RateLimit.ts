import rateLimit from 'express-rate-limit'

export default function Ratelimit () {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite cada IP para 100 solicitações por janela (aqui, por 15 minutos).
    standardHeaders: 'draft-7', // draft-6: cabeçalhos `RateLimit-*`; draft-7: cabeçalho `RateLimit` combinado
    legacyHeaders: false, // Desative os cabeçalhos `X-RateLimit-*`.
    message: {
      status: 'undetermined',
      message: 'Too many requests, please try again later.'
    }
  })
}
