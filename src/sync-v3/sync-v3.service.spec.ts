import { Test, TestingModule } from '@nestjs/testing';
import { SyncV3Service } from './sync-v3.service';

describe('SyncV3Service', () => {
  let service: SyncV3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyncV3Service],
    }).compile();

    service = module.get<SyncV3Service>(SyncV3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
