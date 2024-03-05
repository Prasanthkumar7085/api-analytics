import { Test, TestingModule } from '@nestjs/testing';
import { CaseTypesController } from './case-types.controller';
import { CaseTypesService } from './case-types.service';

describe('CaseTypesController', () => {
  let controller: CaseTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaseTypesController],
      providers: [CaseTypesService],
    }).compile();

    controller = module.get<CaseTypesController>(CaseTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
