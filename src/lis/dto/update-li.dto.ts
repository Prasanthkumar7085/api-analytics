import { PartialType } from '@nestjs/mapped-types';
import { CreateLiDto } from './create-li.dto';

export class UpdateLiDto extends PartialType(CreateLiDto) {}
