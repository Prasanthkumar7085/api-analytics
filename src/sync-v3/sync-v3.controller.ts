import { Controller } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';

@Controller('sync-v3')
export class SyncV3Controller {
  constructor(private readonly syncV3Service: SyncV3Service) {}
}
