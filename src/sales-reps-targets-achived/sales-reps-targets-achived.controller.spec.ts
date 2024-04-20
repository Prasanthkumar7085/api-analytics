import { Test, TestingModule } from '@nestjs/testing';
import { SalesRepsTargetsAchivedController } from './sales-reps-targets-achived.controller';
import { SalesRepsTargetsAchivedService } from './sales-reps-targets-achived.service';

describe('SalesRepsTargetsAchivedController', () => {
  let controller: SalesRepsTargetsAchivedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesRepsTargetsAchivedController],
      providers: [SalesRepsTargetsAchivedService],
    }).compile();

    controller = module.get<SalesRepsTargetsAchivedController>(SalesRepsTargetsAchivedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
