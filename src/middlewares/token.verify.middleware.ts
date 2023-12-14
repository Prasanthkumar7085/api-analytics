
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ExpiredTokenMiddleware implements NestMiddleware {
    constructor() { }

    use(req: Request, res: Response, next: NextFunction) {
        let authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                success: false,
                message: "Authorization is Required!"
            })
        }

        let splited = authorization.split(" ");

        const accessToken = splited[1]

        const apiKey = process.env.API_KEY;

        if (accessToken !== apiKey) {
            return res.status(401).json({
                success: false,
                message: "Invalid Authorization!"
            })
        }

        next();
    }

}