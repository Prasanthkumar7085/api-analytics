import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaseTypesModule } from './case-types/case-types.module';
import configuration from './config/configuration';
import { DrizzleModule } from './drizzle/drizzle.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { InsurancesModule } from './insurances/insurances.module';
import { LisModule } from './lis/lis.module';
import { CheckAuthKeyMiddleWare } from './middlewares/authKey.verify.middleware';
import { OverviewModule } from './overview/overview.module';
import { RevenueStatsModule } from './revenue-stats/revenue-stats.module';
import { SalesRepModule } from './sales-rep/sales-rep.module';
import { SyncModule } from './sync/sync.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.LIS_DB_URL + '&authSource=admin'),
    LisModule, RevenueStatsModule, DrizzleModule, SalesRepModule, FacilitiesModule, CaseTypesModule, OverviewModule, InsurancesModule, SyncModule],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckAuthKeyMiddleWare)
    .exclude(
      { path: 'v1.0/sync/patient-claims-remove', method: RequestMethod.GET },
      { path: 'v1.0/sync/patient-claims', method: RequestMethod.GET },
      { path: 'v1.0/sync/managers', method: RequestMethod.GET },
      { path: 'v1.0/sync/marketers', method: RequestMethod.GET },
      { path: 'v1.0/sync/case-types', method: RequestMethod.GET },
      { path: 'v1.0/sync/insurance-payors', method: RequestMethod.GET },
      { path: 'v1.0/sync/facilities', method: RequestMethod.GET }
    )
    .forRoutes('*');
  }
}
