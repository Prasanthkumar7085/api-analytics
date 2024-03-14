import { PartialType } from '@nestjs/mapped-types';
import { CreateInsurancesV3Dto } from './create-insurances-v3.dto';

export class UpdateInsurancesV3Dto extends PartialType(CreateInsurancesV3Dto) {}
