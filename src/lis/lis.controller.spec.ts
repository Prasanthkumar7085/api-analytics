import { Test, TestingModule } from '@nestjs/testing';
import { LisController } from './lis.controller';
import { LisService } from './lis.service';

describe('LisController', () => {
  let controller: LisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LisController],
      providers: [LisService],
    }).compile();

    controller = module.get<LisController>(LisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
