import { Test, TestingModule } from '@nestjs/testing';
import { FacilitiesV3Controller } from './facilities-v3.controller';
import { FacilitiesV3Service } from './facilities-v3.service';

describe('FacilitiesV3Controller', () => {
  let controller: FacilitiesV3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacilitiesV3Controller],
      providers: [FacilitiesV3Service],
    }).compile();

    controller = module.get<FacilitiesV3Controller>(FacilitiesV3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
