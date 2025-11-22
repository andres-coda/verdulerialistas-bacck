import { Test, TestingModule } from '@nestjs/testing';
import { RubroService } from '../rubro.service';

describe('RubroService', () => {
  let service: RubroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RubroService],
    }).compile();

    service = module.get<RubroService>(RubroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
