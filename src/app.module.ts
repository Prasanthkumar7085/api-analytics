import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { LisModule } from './lis/lis.module';
import { QueueBodyMiddleware } from './middlewares/queueBody.middleware';
import { ExpiredTokenMiddleware } from './middlewares/token.verify.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { RevenueStatsModule } from './revenue-stats/revenue-stats.module';
import { UserSchema } from './schemas/userSchema';
import { StatsModule } from './stats/stats.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { SalesRepModule } from './sales-rep-v3/sales-rep-v3.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forFeature([{ name: 'UserSchema', schema: UserSchema }]),
    MongooseModule.forRoot(process.env.LIS_DB_URL + '?authSource=admin'),
    StatsModule, PrismaModule, LisModule, RevenueStatsModule, DrizzleModule, SalesRepModule],
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
