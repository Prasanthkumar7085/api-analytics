import { PartialType } from '@nestjs/mapped-types';
import { CreateRevenueStatDto } from './create-revenue-stat.dto';

export class UpdateRevenueStatDto extends PartialType(CreateRevenueStatDto) {}
