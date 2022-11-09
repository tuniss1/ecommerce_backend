import { Module } from '@nestjs/common';
import { UserModule } from '../auth_modules/model/user/user.module';
import { ProductModule } from './model/product/product.module';
import { CategoryModule } from './model/category/category.module';
@Module({
  imports: [UserModule, ProductModule, CategoryModule],
  providers: [],
  exports: [],
})
export class EcomModule {}
