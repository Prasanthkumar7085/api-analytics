import { Module } from '@nestjs/common';
import { LisService } from './lis.service';
import { LisController } from './lis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/userSchema';

@Module({
  controllers: [LisController],
  providers: [LisService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ]),
  ]
})
export class LisModule {}
