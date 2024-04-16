import { Injectable } from '@nestjs/common';
import { CreateSalesRepsTargetDto } from './dto/create-sales-reps-target.dto';
import { UpdateSalesRepsTargetDto } from './dto/update-sales-reps-target.dto';

@Injectable()
export class SalesRepsTargetsService {
  create(createSalesRepsTargetDto: CreateSalesRepsTargetDto) {
    return 'This action adds a new salesRepsTarget';
  }

  findAll() {
    return `This action returns all salesRepsTargets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salesRepsTarget`;
  }

  update(id: number, updateSalesRepsTargetDto: UpdateSalesRepsTargetDto) {
    return `This action updates a #${id} salesRepsTarget`;
  }

  remove(id: number) {
    return `This action removes a #${id} salesRepsTarget`;
  }
}
