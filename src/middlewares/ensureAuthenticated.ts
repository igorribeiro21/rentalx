import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import { UsersRepository } from '../modules/accounts/repositories/UsersRepository';

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token missing", 401);
    }

    const [, token] = authHeader.split(" ");
    try {
        const { sub: user_id } = verify(token, "7e654deda8bee49e7fcd649abc5e602e") as IPayload;

        const usersRepository = new UsersRepository();

        const user = await usersRepository.findById(user_id);

        if (!user) {
            throw new AppError("User does not exists!",401);
        }
        
        req.user = {
            id: user_id
        };

        next();
    } catch {
        throw new AppError("Invalid token!",401);
    }


}