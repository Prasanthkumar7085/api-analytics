import { Test, TestingModule } from '@nestjs/testing';
import { SyncV3Controller } from './sync-v3.controller';
import { SyncV3Service } from './sync-v3.service';

describe('SyncV3Controller', () => {
  let controller: SyncV3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncV3Controller],
      providers: [SyncV3Service],
    }).compile();

    controller = module.get<SyncV3Controller>(SyncV3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
