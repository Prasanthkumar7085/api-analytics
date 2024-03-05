import { Injectable } from '@nestjs/common';
import { CreateCaseTypeDto } from './dto/create-case-type.dto';
import { UpdateCaseTypeDto } from './dto/update-case-type.dto';

@Injectable()
export class CaseTypesService {
  create(createCaseTypeDto: CreateCaseTypeDto) {
    return 'This action adds a new caseType';
  }

  findAll() {
    return `This action returns all caseTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} caseType`;
  }

  update(id: number, updateCaseTypeDto: UpdateCaseTypeDto) {
    return `This action updates a #${id} caseType`;
  }

  remove(id: number) {
    return `This action removes a #${id} caseType`;
  }
}
