import { Test, TestingModule } from '@nestjs/testing';
import { FacilitiesV3Service } from './facilities-v3.service';

describe('FacilitiesV3Service', () => {
  let service: FacilitiesV3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacilitiesV3Service],
    }).compile();

    service = module.get<FacilitiesV3Service>(FacilitiesV3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
