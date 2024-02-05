import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatsModule } from './stats/stats.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ExpiredTokenMiddleware } from './middlewares/token.verify.middleware';
import { QueueBodyMiddleware } from './middlewares/queueBody.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/userSchema';
import { LisModule } from './lis/lis.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forFeature([{ name: 'UserSchema', schema: UserSchema }]),
    MongooseModule.forRoot(process.env.LIS_DB_URL + '?authSource=admin'),
    StatsModule, PrismaModule, LisModule],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExpiredTokenMiddleware).forRoutes('*');
    consumer.apply(QueueBodyMiddleware)
    .forRoutes(
      {
      path: 'v1.0/marketers-stats/case/pending',
      method: RequestMethod.POST,
    },
    {
      path: 'v1.0/marketers-stats/case/complete/conform',
      method: RequestMethod.POST,
    },
    {
      path: 'v1.0/marketers-stats/case/complete/retrieve',
      method: RequestMethod.POST,
    })
  }
}
