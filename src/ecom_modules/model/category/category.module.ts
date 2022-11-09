import { Module } from '@nestjs/common';
import { CategoryRepo, UserRepo } from '../../repo';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';
import { CategoryController } from '../../controller/category/category.controller';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { CategoryService } from '../../service/category.service';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [
    CategoryRepo,
    CategoryService,
    AuthMiddleware,
    UserRepo,
    ResponseService,
  ],
  exports: [],
})
export class CategoryModule {}
