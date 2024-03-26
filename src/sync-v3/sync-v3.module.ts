import { Module } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { SyncV3Controller } from './sync-v3.controller';

@Module({
  controllers: [SyncV3Controller],
  providers: [SyncV3Service],
})
export class SyncV3Module {}
