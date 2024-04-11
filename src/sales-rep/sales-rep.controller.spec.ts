import { Test, TestingModule } from '@nestjs/testing';
import { SalesRepController } from './sales-rep.controller';
import { SalesRepService } from './sales-rep.service';

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
