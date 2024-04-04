
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { Configuration } from 'src/config/config.service';
import { AUTH_KEY_INVALID, AUTH_KEY_REQUIRED } from 'src/constants/messageConstants';

@Injectable()
export class CheckAuthKeyMiddleWare implements NestMiddleware {
    constructor() { }

    use(req: Request, res: Response, next: NextFunction) {
        let authKey: any = req.headers["ls-auth-key"];

        if (!authKey) {
            return res.status(403).json({
                success: false,
                message: AUTH_KEY_REQUIRED
            });
        }

        const parts = authKey.split(' ');
        const apiKey = parts[1];

        const configuration = new Configuration(new ConfigService());

        const { ls_api_key } = configuration.getConfig();

        if (ls_api_key !== apiKey) {
            return res.status(422).json({
                success: false,
                message: AUTH_KEY_INVALID
            });
        }

        next();
    }

}