import { Test, TestingModule } from '@nestjs/testing';
import { SalesRepsTargetsAchivedService } from './sales-reps-targets-achived.service';

describe('SalesRepsTargetsAchivedService', () => {
  let service: SalesRepsTargetsAchivedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesRepsTargetsAchivedService],
    }).compile();

    service = module.get<SalesRepsTargetsAchivedService>(SalesRepsTargetsAchivedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
