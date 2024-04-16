import { Test, TestingModule } from '@nestjs/testing';
import { SalesRepsTargetsController } from './sales-reps-targets.controller';
import { SalesRepsTargetsService } from './sales-reps-targets.service';

describe('SalesRepsTargetsController', () => {
  let controller: SalesRepsTargetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesRepsTargetsController],
      providers: [SalesRepsTargetsService],
    }).compile();

    controller = module.get<SalesRepsTargetsController>(SalesRepsTargetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
