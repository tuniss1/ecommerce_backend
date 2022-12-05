import { Module } from '@nestjs/common';
import { CategoryRepo, ProductRepo, UserRepo } from '../../repo';
import { ProductService } from '../../service/product.service';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';
import { ProductController } from '../../controller/product/product.controller';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { CategoryService } from '../../../ecom_modules/service/category.service';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    CategoryService,
    CategoryRepo,
    ProductRepo,
    ProductService,
    AuthMiddleware,
    UserRepo,
    ResponseService,
  ],
  exports: [ProductService],
})
export class ProductModule {}
