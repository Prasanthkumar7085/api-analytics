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
import { MghSyncModule } from './mgh-sync/mgh-sync.module';
import { LabsModule } from './labs/labs.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    LisModule, RevenueStatsModule, DrizzleModule, SalesRepModule, FacilitiesModule, CaseTypesModule, OverviewModule, InsurancesModule, SyncModule, MghSyncModule, LabsModule],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}
