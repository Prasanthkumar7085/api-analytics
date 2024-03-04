import { Module } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { SalesRepController } from './sales-rep.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';
import { SalesRepHelper } from 'src/helpers/salesRepHelper';

@Module({
  controllers: [SalesRepController],
  providers: [SalesRepService, SalesRepHelper],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ]),
  ]
})
export class SalesRepModule {}
