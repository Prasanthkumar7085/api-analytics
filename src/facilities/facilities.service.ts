import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HospitalModel } from 'src/schemas/hospitalSchema';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectModel('Hospital') private hospitalModel: typeof HospitalModel
  ) { }

  getHospital(hospitalId){
    return this.hospitalModel.findById(hospitalId)
  }
  
}
