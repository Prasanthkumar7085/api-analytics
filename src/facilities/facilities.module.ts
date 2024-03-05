import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesHelper } from 'src/helpers/facilitiesHelper';

import { MongooseModule } from '@nestjs/mongoose';
import { HospitalSchema } from 'src/schemas/hospitalSchema';


@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FacilitiesHelper],
  imports: [
    MongooseModule.forFeature([
      { name: 'Hospital', schema: HospitalSchema }
    ]),
  ]
})
export class FacilitiesModule { }
