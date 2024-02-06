import { Test, TestingModule } from '@nestjs/testing';
import { LisService } from './lis.service';

describe('LisService', () => {
  let service: LisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LisService],
    }).compile();

    service = module.get<LisService>(LisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
