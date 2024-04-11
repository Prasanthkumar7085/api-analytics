import { PartialType } from '@nestjs/mapped-types';
import { CreateInsurancesDto } from './create-insurances.dto';

export class UpdateInsurancesDto extends PartialType(CreateInsurancesDto) {}
