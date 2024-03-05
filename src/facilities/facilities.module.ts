import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesHelper } from 'src/helpers/facilitiesHelper';
<<<<<<< HEAD
import { MongooseModule } from '@nestjs/mongoose';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
=======
>>>>>>> features/facilities-stats-casetypes

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FacilitiesHelper],
<<<<<<< HEAD
  imports: [
    MongooseModule.forFeature([
      { name: 'Hospital', schema: HospitalSchema }
    ]),
  ]
=======
>>>>>>> features/facilities-stats-casetypes
})
export class FacilitiesModule {}
