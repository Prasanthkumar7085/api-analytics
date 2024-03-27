import { Module } from '@nestjs/common';
import { FacilitiesV3Service } from './facilities-v3.service';
import { FacilitiesV3Controller } from './facilities-v3.controller';
import { FilterHelper } from 'src/helpers/filterHelper';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';

@Module({
  controllers: [FacilitiesV3Controller],
  providers: [FacilitiesV3Service, FilterHelper, JwtService, LisService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema }
    ]),
  ]

})
export class FacilitiesV3Module { }
