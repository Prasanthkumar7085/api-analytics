import { Test, TestingModule } from '@nestjs/testing';
import { CaseTypesService } from './case-types.service';

describe('CaseTypesService', () => {
  let service: CaseTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaseTypesService],
    }).compile();

    service = module.get<CaseTypesService>(CaseTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
