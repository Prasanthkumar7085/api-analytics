import { PartialType } from '@nestjs/mapped-types';
import { CreateCaseTypeDto } from './create-case-type.dto';

export class UpdateCaseTypeDto extends PartialType(CreateCaseTypeDto) {}
