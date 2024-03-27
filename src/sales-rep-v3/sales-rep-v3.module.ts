import { Module } from '@nestjs/common';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SalesRepControllerV3 } from './sales-rep-v3.controller';
import { SalesRepServiceV3 } from './sales-rep-v3.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { JwtService } from '@nestjs/jwt';
import { LisService } from 'src/lis/lis.service';

@Module({
  controllers: [SalesRepControllerV3],
  providers: [SalesRepServiceV3, FilterHelper, JwtService, LisService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema }
    ]),
  ]
})
export class SalesRepModuleV3 { }
