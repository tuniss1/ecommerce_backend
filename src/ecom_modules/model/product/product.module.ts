import { forwardRef, Module } from '@nestjs/common';
import { CategoryRepo, ProductRepo, UserRepo } from '../../repo';
import { ProductService } from '../../service/product.service';
import { ProductController } from '../../controller/product/product.controller';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../../../ecom_modules/service/category.service';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';

@Module({
  imports: [forwardRef(() => CategoryModule)],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepo,
    CategoryService,
    CategoryRepo,
    ResponseService,
    UserRepo,
    AuthMiddleware,
  ],
  exports: [ProductService, ProductRepo],
})
export class ProductModule {}
