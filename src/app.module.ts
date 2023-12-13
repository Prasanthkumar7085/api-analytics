import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatsModule } from './stats/stats.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }), 
    StatsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
