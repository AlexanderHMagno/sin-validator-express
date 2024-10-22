import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds per IP
});

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  rateLimiter
    .consume(req.ip || '')
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({
        isError: true,
        message: 'Too many requests, please try again later',
      });
    });
};
