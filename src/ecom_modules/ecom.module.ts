import { Module } from '@nestjs/common';
import { UserModule } from '../auth_modules/model/user/user.module';
import { ProductModule } from './model/product/product.module';

@Module({
  imports: [UserModule, ProductModule],
  providers: [],
  exports: [],
})
export class EcomModule {}
