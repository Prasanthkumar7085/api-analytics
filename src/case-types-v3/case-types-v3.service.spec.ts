import { Test, TestingModule } from '@nestjs/testing';
import { CaseTypesV3Service } from './case-types-v3.service';

describe('CaseTypesV3Service', () => {
  let service: CaseTypesV3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaseTypesV3Service],
    }).compile();

    service = module.get<CaseTypesV3Service>(CaseTypesV3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
