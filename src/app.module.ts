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
import { SalesRepModule } from './sales-rep/sales-rep.module';
import { OverviewModule } from './overview/overview.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { CaseTypesModule } from './case-types/case-types.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { SalesRepModuleV3 } from './sales-rep-v3/sales-rep-v3.module';
import { FacilitiesV3Module } from './facilities-v3/facilities-v3.module';
import { CaseTypesV3Module } from './case-types-v3/case-types-v3.module';
import { OverviewV3Module } from './overview-v3/overview-v3.module';
import { InsurancesV3Module } from './insurances-v3/insurances-v3.module';
import { SyncV3Module } from './sync-v3/sync-v3.module';
import { insurancePayorsSchema } from './schemas/insurancPayors';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.LIS_DB_URL + '&authSource=admin'),
    StatsModule, PrismaModule, LisModule, RevenueStatsModule, SalesRepModule, OverviewModule, FacilitiesModule, CaseTypesModule,
    DrizzleModule, SalesRepModuleV3, FacilitiesV3Module, CaseTypesV3Module, OverviewV3Module, InsurancesV3Module, SyncV3Module],
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
