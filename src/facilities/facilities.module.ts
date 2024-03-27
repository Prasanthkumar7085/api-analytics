import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesHelper } from 'src/helpers/facilitiesHelper';

import { MongooseModule } from '@nestjs/mongoose';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';


@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FacilitiesHelper, JwtService, LisService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Hospital', schema: HospitalSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema }


    ]),
  ]
})
export class FacilitiesModule { }
