import { Test, TestingModule } from '@nestjs/testing';
import { RubroController } from '../rubro.controller';

describe('RubroController', () => {
  let controller: RubroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RubroController],
    }).compile();

    controller = module.get<RubroController>(RubroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
