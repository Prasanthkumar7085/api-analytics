import { Module } from '@nestjs/common';
import { SalesRepsTargetsController } from './sales-reps-targets.controller';
import { SalesRepsTargetsService } from './sales-reps-targets.service';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { EmailServiceProvider } from 'src/notifications/emailServiceProvider';
import { SESAPIDataServiceProvider } from 'src/notifications/sesAPIDataServiceProvider';
import { Configuration } from 'src/config/config.service';
import { ConfigService } from '@nestjs/config';
import { FilterHelper } from 'src/helpers/filterHelper';

@Module({
  controllers: [SalesRepsTargetsController],
  providers: [SalesRepsTargetsService, SalesRepService, EmailServiceProvider, SESAPIDataServiceProvider, Configuration, ConfigService, FilterHelper],
})
export class SalesRepsTargetsModule { }
