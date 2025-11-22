import { Test, TestingModule } from '@nestjs/testing';
import { PedidoProductoController } from '../pedido_producto.controller';

describe('PedidoProductoController', () => {
  let controller: PedidoProductoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoProductoController],
    }).compile();

    controller = module.get<PedidoProductoController>(PedidoProductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
