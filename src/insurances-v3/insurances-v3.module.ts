import { Module } from '@nestjs/common';
import { InsurancesV3Service } from './insurances-v3.service';
import { InsurancesV3Controller } from './insurances-v3.controller';
import { FilterHelper } from 'src/helpers/filterHelper';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';

@Module({
  controllers: [InsurancesV3Controller],
  providers: [InsurancesV3Service, FilterHelper, JwtService, LisService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema }
    ]),
  ]
})
export class InsurancesV3Module { }
