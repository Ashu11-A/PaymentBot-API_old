declare module 'express' {
    interface Request {
        accessToken?: jwt.JwtPayload
    }
}

export {}
