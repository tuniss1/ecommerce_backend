import { Injectable } from '@nestjs/common';
import { CategoryRepo, ProductRepo } from '../repo';
import { CreateProductReq } from '../request';
import { CategoryService } from './category.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly categoryService: CategoryService,
  ) {}

  async createProduct(createProductReq: CreateProductReq) {
    this.categoryService.upsert(createProductReq.categoryName);
    const newProduct = await this.productRepo.create(createProductReq);
    return newProduct;
  }

  async getAll({
    page,
    limit,
    categoryName,
    minPrice,
    maxPrice,
  }: {
    page?: number;
    limit?: number;
    categoryName?: string;
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
    if (categoryName != null)
      res.data = res.data.filter((e) => e.categoryName == categoryName);
    return { listRoom: res };
  }

  async getStatus({
    categoryName,
    minPrice,
    maxPrice,
  }: {
    categoryName?: string;
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
    if (categoryName != null)
      res = res.filter((e) => e.categoryName == categoryName);
    return { count: res.length, minPrice: minPrice, maxPrice: maxPrice };
  }
}
