import { Module } from '@nestjs/common';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SalesRepControllerV3 } from './sales-rep-v3.controller';
import { SalesRepServiceV3 } from './sales-rep-v3.service';


@Module({
  controllers: [SalesRepControllerV3],
  providers: [SalesRepServiceV3, FilterHelper],
})
export class SalesRepModuleV3 { }
