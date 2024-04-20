import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesRepsTargetsAchivedDto } from './create-sales-reps-targets-achived.dto';

export class UpdateSalesRepsTargetsAchivedDto extends PartialType(CreateSalesRepsTargetsAchivedDto) {}
