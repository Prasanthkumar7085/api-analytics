import { Test, TestingModule } from '@nestjs/testing';
import { OverviewV3Controller } from './overview-v3.controller';
import { OverviewV3Service } from './overview-v3.service';

describe('OverviewV3Controller', () => {
  let controller: OverviewV3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OverviewV3Controller],
      providers: [OverviewV3Service],
    }).compile();

    controller = module.get<OverviewV3Controller>(OverviewV3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
