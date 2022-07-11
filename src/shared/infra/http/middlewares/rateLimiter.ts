import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../errors/AppError';

const url = 'redis://localhost:6379';
const redisClient = redis.createClient({
    url
});
const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimiter',
    points: 10, // 10 requests
    duration: 1, // per 1 second by IP
});

export default async function rateLimiter(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await limiter.consume(req.ip);
        next();
    }
    catch (err) {
        throw new AppError('Too many requests', 429);
    }
}