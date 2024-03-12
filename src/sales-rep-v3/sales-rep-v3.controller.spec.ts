import { Test, TestingModule } from '@nestjs/testing';
import { SalesRepController } from './sales-rep-v3.controller';
import { SalesRepService } from './sales-rep-v3.service';

describe('SalesRepController', () => {
  let controller: SalesRepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesRepController],
      providers: [SalesRepService],
    }).compile();

    controller = module.get<SalesRepController>(SalesRepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
