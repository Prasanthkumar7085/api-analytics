import { Controller } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';

@Controller({
  version: '3.0',
  path: 'sync'
})

export class SyncV3Controller {
  constructor(private readonly syncV3Service: SyncV3Service) { }
}
