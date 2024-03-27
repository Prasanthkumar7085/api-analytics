import { Module } from '@nestjs/common';
import { LisService } from './lis.service';
import { LisController } from './lis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { CaseSchema } from 'src/schemas/caseSchema';
import { insurancePayorsSchema } from 'src/schemas/insurancPayors';

@Module({
  controllers: [LisController],
  providers: [LisService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Case', schema: CaseSchema },
      { name: 'InsurancePayors', schema: insurancePayorsSchema }
    ]),
  ]
})
export class LisModule { }
