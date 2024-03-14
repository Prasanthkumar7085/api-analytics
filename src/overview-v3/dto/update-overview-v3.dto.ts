import { PartialType } from '@nestjs/mapped-types';
import { CreateOverviewV3Dto } from './create-overview-v3.dto';

export class UpdateOverviewV3Dto extends PartialType(CreateOverviewV3Dto) {}
