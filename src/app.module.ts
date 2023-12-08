import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatsModule } from './stats/stats.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }), 
    StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
