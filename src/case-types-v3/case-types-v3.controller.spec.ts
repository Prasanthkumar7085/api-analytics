import { Test, TestingModule } from '@nestjs/testing';
import { CaseTypesV3Controller } from './case-types-v3.controller';
import { CaseTypesV3Service } from './case-types-v3.service';

describe('CaseTypesV3Controller', () => {
  let controller: CaseTypesV3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaseTypesV3Controller],
      providers: [CaseTypesV3Service],
    }).compile();

    controller = module.get<CaseTypesV3Controller>(CaseTypesV3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
