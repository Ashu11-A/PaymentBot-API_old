declare module 'express' {
    interface Request {
        user?: jwt.JwtPayload
    }
}

export {}
