import { Module } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { SalesRepController } from './sales-rep.controller';
import { FilterHelper } from 'src/helpers/filterHelper';

@Module({
  controllers: [SalesRepController],
  providers: [SalesRepService, FilterHelper],
})
export class SalesRepModule {}
