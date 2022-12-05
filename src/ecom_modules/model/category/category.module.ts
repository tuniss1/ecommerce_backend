import { Module } from '@nestjs/common';
import { CategoryRepo, ProductRepo, UserRepo } from '../../repo';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';
import { CategoryController } from '../../controller/category/category.controller';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { CategoryService } from '../../service/category.service';
import { ProductService } from '../../service/product.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [CategoryController],
  providers: [
    CategoryRepo,
    CategoryService,
    AuthMiddleware,
    UserRepo,
    ResponseService,
    ProductService,
    ProductRepo,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
