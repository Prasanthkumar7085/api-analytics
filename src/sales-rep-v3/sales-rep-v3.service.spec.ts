import { Test, TestingModule } from '@nestjs/testing';
import { SalesRepService } from './sales-rep-v3.service';

describe('SalesRepService', () => {
  let service: SalesRepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesRepService],
    }).compile();

    service = module.get<SalesRepService>(SalesRepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
