import { Test, TestingModule } from '@nestjs/testing';
import { OverviewV3Service } from './overview-v3.service';

describe('OverviewV3Service', () => {
  let service: OverviewV3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OverviewV3Service],
    }).compile();

    service = module.get<OverviewV3Service>(OverviewV3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
