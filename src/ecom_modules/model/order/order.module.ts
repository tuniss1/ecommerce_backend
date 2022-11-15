import { Module } from '@nestjs/common';
import { OrderRepo, CategoryRepo, ProductRepo, UserRepo } from '../../repo';
import { OrderService } from '../../service/order.service';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';
import { OrderController } from '../../controller/order/order.controller';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { CategoryService } from '../../service/category.service';
import { ProductService } from '../../service/product.service';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    ProductRepo,
    ProductService,
    AuthMiddleware,
    UserRepo,
    ResponseService,
    CategoryService,
    CategoryRepo,
    OrderService,
    OrderRepo,
  ],
  exports: [],
})
export class OrderModule {}
