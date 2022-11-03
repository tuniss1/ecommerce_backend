import { Injectable } from '@nestjs/common';
import { ProductRepo } from '../repo';
import { CreateProductReq } from '../request';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}

  async createProduct(createProductReq: CreateProductReq) {
    const newProduct = await this.productRepo.create(createProductReq);
    return newProduct;
  }

  async getAll({
    page,
    limit,
    categoryId,
    minPrice,
    maxPrice,
  }: {
    page?: number;
    limit?: number;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
  }) {
    if (!page || page <= 0) {
      page = 1;
    }
    if (!limit) {
      limit = 20;
    }

    const res = await this.productRepo.findAllAndPaging(
      { page, limit, sort: {} },
      {
        price: {
          $lt: maxPrice ? maxPrice : 9999999999999,
          $gt: minPrice ? minPrice : 0,
        },
      },
    );
    if (categoryId != null)
      res.data = res.data.filter((e) => e.category.id == categoryId);
    return { listRoom: res };
  }

  async getStatus({
    categoryId,
    minPrice,
    maxPrice,
  }: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
  }) {
    let res = await this.productRepo.getAll(
      {},
      {
        price: {
          $lt: maxPrice ? maxPrice : 9999999999999,
          $gt: minPrice ? minPrice : 0,
        },
      },
    );
    if (categoryId != null)
      res = res.filter((e) => e.category.id == categoryId);
    return { count: res.length, minPrice: minPrice, maxPrice: maxPrice };
  }
}
