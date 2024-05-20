
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';

@Injectable()
export class ActiveSalesRepsMiddleware implements NestMiddleware {
    constructor(
        private readonly salesRepService: SalesRepService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {

        let query: any = req.query;

        if (!query.sales_reps) {
            const idsData = await this.salesRepService.getActiveSalesReps();

            const ids = idsData.map(e => e.id);

            query.sales_rep_ids = ids;
        }

        next();
    }

}