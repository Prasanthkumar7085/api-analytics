import { Module } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { SalesRepController } from './sales-rep.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';

@Module({
  controllers: [SalesRepController],
  providers: [SalesRepService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ]),
  ]
})
export class SalesRepModule {}
