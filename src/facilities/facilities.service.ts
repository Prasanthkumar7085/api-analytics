import { Injectable } from '@nestjs/common';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
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
