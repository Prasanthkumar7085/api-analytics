import { Test, TestingModule } from '@nestjs/testing';
import { RevenueStatsController } from './revenue-stats.controller';
import { RevenueStatsService } from './revenue-stats.service';

describe('RevenueStatsController', () => {
  let controller: RevenueStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevenueStatsController],
      providers: [RevenueStatsService],
    }).compile();

    controller = module.get<RevenueStatsController>(RevenueStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
