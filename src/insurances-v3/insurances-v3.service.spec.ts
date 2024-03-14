import { Test, TestingModule } from '@nestjs/testing';
import { InsurancesV3Service } from './insurances-v3.service';

describe('InsurancesV3Service', () => {
  let service: InsurancesV3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsurancesV3Service],
    }).compile();

    service = module.get<InsurancesV3Service>(InsurancesV3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
