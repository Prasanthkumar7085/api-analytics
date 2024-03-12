import { Test, TestingModule } from '@nestjs/testing';
import { InsurancesV3Controller } from './insurances-v3.controller';
import { InsurancesV3Service } from './insurances-v3.service';

describe('InsurancesV3Controller', () => {
  let controller: InsurancesV3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsurancesV3Controller],
      providers: [InsurancesV3Service],
    }).compile();

    controller = module.get<InsurancesV3Controller>(InsurancesV3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
