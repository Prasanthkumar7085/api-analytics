import { Module } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { SyncV3Controller } from './sync-v3.controller';
import { LisService } from 'src/lis/lis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { syncHelpers } from 'src/helpers/syncHelper';
import { SalesRepServiceV3 } from 'src/sales-rep-v3/sales-rep-v3.service';
import { HospitalSchema } from 'src/schemas/hospitalSchema';
import { FacilitiesV3Service } from 'src/facilities-v3/facilities-v3.service';

@Module({
  controllers: [SyncV3Controller],
  providers: [SyncV3Service, LisService, syncHelpers, SalesRepServiceV3, FacilitiesV3Service],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema },
      { name: 'hospitals', schema: HospitalSchema}
    ]),
  ]
})
export class SyncV3Module {}
