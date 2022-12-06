import { Module } from '@nestjs/common';
import { OrderRepo, UserRepo } from '../../repo';
import { OrderService } from '../../service/order.service';
import { OrderController } from '../../controller/order/order.controller';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepo,
    UserRepo,
    ResponseService,
    AuthMiddleware,
  ],
  exports: [],
})
export class OrderModule {}
