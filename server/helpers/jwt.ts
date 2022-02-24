/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { sign, verify, VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader: string = req.headers.authorization;
    const token: string = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err: VerifyErrors, user: string) => {
        if (err) {
            return res.sendStatus(403);
        }
        (req as any).user = user;
        next();
    });
}

export async function generateAccessToken(username: string): Promise<string> {
    return sign({ data: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}
