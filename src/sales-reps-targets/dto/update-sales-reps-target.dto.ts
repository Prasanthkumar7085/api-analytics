import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesRepsTargetDto } from './create-sales-reps-target.dto';

export class UpdateSalesRepsTargetDto extends PartialType(CreateSalesRepsTargetDto) {}
