import { Test, TestingModule } from '@nestjs/testing';
import { LabsController } from './labs.controller';
import { LabsService } from './labs.service';

describe('LabsController', () => {
  let controller: LabsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabsController],
      providers: [LabsService],
    }).compile();

    controller = module.get<LabsController>(LabsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
