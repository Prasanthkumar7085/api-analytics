import { Module } from '@nestjs/common';
import { OverviewV3Service } from './overview-v3.service';
import { OverviewV3Controller } from './overview-v3.controller';
import { FilterHelper } from 'src/helpers/filterHelper';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';
@Module({
  controllers: [OverviewV3Controller],
  providers: [OverviewV3Service, FilterHelper, JwtService, LisService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema }
    ]),
  ]
})
export class OverviewV3Module { }
