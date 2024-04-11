import { Test, TestingModule } from '@nestjs/testing';
import { MghSyncService } from './mgh-sync.service';

describe('MghSyncService', () => {
  let service: MghSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MghSyncService],
    }).compile();

    service = module.get<MghSyncService>(MghSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
