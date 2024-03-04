import { Injectable } from '@nestjs/common';
import { CreateSalesRepDto } from './dto/create-sales-rep.dto';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';
import { UserModel } from 'src/schemas/userSchema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SalesRepService {
  constructor(
    @InjectModel('User') private userModel: typeof UserModel
  ) { }

  async getMarketer(id) {
    return await this.userModel.findById(id);
}
}
