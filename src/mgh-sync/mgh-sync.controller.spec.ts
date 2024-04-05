import { Test, TestingModule } from '@nestjs/testing';
import { MghSyncController } from './mgh-sync.controller';
import { MghSyncService } from './mgh-sync.service';

describe('MghSyncController', () => {
  let controller: MghSyncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MghSyncController],
      providers: [MghSyncService],
    }).compile();

    controller = module.get<MghSyncController>(MghSyncController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
