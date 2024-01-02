
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class QueueBodyMiddleware implements NestMiddleware {
    constructor() { }

    use(req: Request, res: Response, next: NextFunction) {

        let reqBody = req.body;

        console.log(reqBody);

        if (reqBody["Message"]) {
            const validJsonString = reqBody["Message"].replace(/'/g, '"');
            const myObject = JSON.parse(validJsonString);
            req.body = myObject
        }
        next();
    }

}