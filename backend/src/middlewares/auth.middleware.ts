import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../../types/express.js';

const authenticateToken = (req : Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = decoded as JWTPayload;
        next();
    })
}

export default authenticateToken;