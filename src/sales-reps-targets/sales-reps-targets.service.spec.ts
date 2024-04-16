import { Test, TestingModule } from '@nestjs/testing';
import { SalesRepsTargetsService } from './sales-reps-targets.service';

describe('SalesRepsTargetsService', () => {
  let service: SalesRepsTargetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesRepsTargetsService],
    }).compile();

    service = module.get<SalesRepsTargetsService>(SalesRepsTargetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
