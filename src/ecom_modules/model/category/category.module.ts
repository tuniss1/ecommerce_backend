import { forwardRef, Module } from '@nestjs/common';
import { CategoryRepo, UserRepo } from '../../repo';
import { CategoryController } from '../../controller/category/category.controller';
import { CategoryService } from '../../service/category.service';
import { ProductService } from '../../service/product.service';
import { ProductModule } from '../product/product.module';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';

@Module({
  imports: [forwardRef(() => ProductModule)],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    AuthMiddleware,
    UserRepo,
    CategoryRepo,
    ResponseService,
  ],
  exports: [],
})
export class CategoryModule {}
