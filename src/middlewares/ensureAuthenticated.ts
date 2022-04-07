import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UsersRepository } from '../modules/accounts/repositories/UsersRepository';

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new Error("Token missing");
    }

    const [, token] = authHeader.split(" ");
    try {
        const { sub: user_id } = verify(token, "7e654deda8bee49e7fcd649abc5e602e") as IPayload;

        const usersRepository = new UsersRepository();

        const user = await usersRepository.findById(user_id);

        if (!user) {
            throw new Error("User does not exists!");
        }

        next();
    } catch {
        throw new Error("Invalid token!");
    }


}