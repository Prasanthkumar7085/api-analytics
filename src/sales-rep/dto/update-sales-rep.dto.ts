import { PartialType } from '@nestjs/mapped-types';
import { SalesRepDto } from './create-sales-rep.dto';

export class UpdateSalesRepDto extends PartialType(SalesRepDto) { }
