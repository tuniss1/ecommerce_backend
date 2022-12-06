import { Module } from '@nestjs/common';
import { ProductModule } from './model/product/product.module';
import { CategoryModule } from './model/category/category.module';
import { OrderModule } from './model/order/order.module';
@Module({
  imports: [ProductModule, CategoryModule, OrderModule],
  providers: [],
  exports: [],
})
export class EcomModule {}
