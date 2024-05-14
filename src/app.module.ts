import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaseTypesModule } from './case-types/case-types.module';
import configuration from './config/configuration';
import { DrizzleModule } from './drizzle/drizzle.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { InsurancesModule } from './insurances/insurances.module';
import { LabsModule } from './labs/labs.module';
import { LisModule } from './lis/lis.module';
import { MghSyncModule } from './mgh-sync/mgh-sync.module';
import { OverviewModule } from './overview/overview.module';
import { RevenueStatsModule } from './revenue-stats/revenue-stats.module';
import { SalesRepModule } from './sales-rep/sales-rep.module';
import { SalesRepsTargetsAchivedModule } from './sales-reps-targets-achived/sales-reps-targets-achived.module';
import { SalesRepsTargetsModule } from './sales-reps-targets/sales-reps-targets.module';
import { SyncModule } from './sync/sync.module';
import { ActiveSalesRepsMiddleware } from './middlewares/activeSalesRepsMiddleWare';
import { SalesRepService } from './sales-rep/sales-rep.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../'),
      renderPath: '/',
    }),
    LisModule, RevenueStatsModule, DrizzleModule, SalesRepModule, FacilitiesModule, CaseTypesModule, OverviewModule, InsurancesModule, SyncModule, MghSyncModule, LabsModule, SalesRepsTargetsModule, SalesRepsTargetsAchivedModule],
  controllers: [AppController],
  providers: [AppService, SalesRepService],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ActiveSalesRepsMiddleware)
      .forRoutes(
        { path: 'v1.0/overview/stats-volume', method: RequestMethod.GET },
        { path: 'v1.0/overview/case-types-volume', method: RequestMethod.GET },
        { path: 'v1.0/overview/case-types-volume-targets', method: RequestMethod.GET },
        { path: 'v1.0/overview/revenue', method: RequestMethod.GET },
        { path: 'v1.0/overview/volume', method: RequestMethod.GET },
        { path: 'v1.0/overview/volume-targets', method: RequestMethod.GET }
      );
  }
}
