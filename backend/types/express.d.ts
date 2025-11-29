export interface JWTPayload {
    _id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
