import { Module } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { SalesRepController } from './sales-rep.controller';

@Module({
  controllers: [SalesRepController],
  providers: [SalesRepService],
})
export class SalesRepModule {}
