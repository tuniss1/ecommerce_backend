import { Module } from '@nestjs/common';
import { CategoryRepo, ProductRepo, UserRepo } from '../../repo';
import { ProductService } from '../../service/product.service';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';
import { ProductController } from '../../controller/product/product.controller';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { CategoryService } from '../../../ecom_modules/service/category.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    ProductRepo,
    ProductService,
    AuthMiddleware,
    UserRepo,
    ResponseService,
    CategoryService,
    CategoryRepo,
  ],
  exports: [],
})
export class ProductModule {}
