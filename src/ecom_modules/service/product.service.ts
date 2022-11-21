import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
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

  async getById({ id }: { id?: ObjectId }) {
    const res = await this.productRepo.getById(id);
    const relatedProduct = await this.getAll({
      page: 0,
      limit: 4,
      categoryName: res.categoryName,
      minPrice: null,
      maxPrice: null,
      sort: null,
    });

    return { data: { ...res, relatedProduct: relatedProduct.listRoom.data } };
  }

  async truncate() {
    await this.productRepo.truncate();
  }

  async getAll({
    page,
    limit,
    categoryName,
    minPrice,
    maxPrice,
    sort,
  }: {
    page?: number;
    limit?: number;
    categoryName?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) {
    if (!page || page <= 0) {
      page = 1;
    }
    if (!limit) {
      limit = 20;
    }

    const sortItem = {};
    if (sort && sort.length) sortItem['price'] = sort;

    const res = await this.productRepo.findAllAndPaging(
      { page, limit, sort: sortItem },
      {
        price: {
          $lte: maxPrice ? maxPrice : 9999999999999,
          $gte: minPrice ? minPrice : 0,
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
          $lte: maxPrice ? maxPrice : 9999999999999,
          $gte: minPrice ? minPrice : 0,
        },
      },
    );
    const resOption = {
      minPrice: null,
      maxPrice: null,
    };
    const haveCategory = categoryName && categoryName.length;

    res = res.filter((e) => {
      if (!resOption.minPrice) resOption.minPrice = e.price;
      if (!resOption.maxPrice) resOption.maxPrice = e.price;

      if (resOption.minPrice > e.price) resOption.minPrice = e.price;
      if (resOption.maxPrice < e.price) resOption.maxPrice = e.price;

      if (haveCategory) return e.categoryName == categoryName;
      return true;
    });
    return {
      count: res.length,
      minPrice: resOption.minPrice,
      maxPrice: resOption.maxPrice,
    };
  }
}
