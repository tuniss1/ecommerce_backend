import { Injectable } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { CategoryRepo } from '../repo';
import { CreateCategoryReq } from '../request';
import { ProductService } from './product.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepo,
    private readonly productService: ProductService,
  ) {}

  async createCategory(createCategoryReq: CreateCategoryReq) {
    const newCategory = await this.categoryRepo.create(createCategoryReq);
    return newCategory;
  }

  async updateCategory({ _id, name }: { _id: string; name: string }) {
    const prevCategory = await this.categoryRepo.updateName(_id, name);
    await this.productService.updateCategory(prevCategory.name, name);

    return { ...prevCategory, name: name };
  }

  async getAll() {
    const res = (await this.categoryRepo.getAll()).filter(
      (category) => category.name !== '',
    );

    return { listRoom: res };
  }

  async findAllAndPaging({
    page,
    limit,
    searchField,
    sort,
  }: {
    page?: number;
    limit?: number;
    searchField?: string;
    sort?: string;
  }) {
    if (!page || page <= 0) {
      page = 1;
    }
    if (!limit) {
      limit = 30;
    }
    if (searchField) searchField = '';

    const sortItem = {};
    if (sort && sort.length) sortItem['createdAt'] = sort;

    const filter = {};

    const res = await this.categoryRepo.findAllAndPaging(
      { page, limit, sort: sortItem },
      filter,
    );

    return { listRoom: res };
  }

  async upsert(categoryName: string) {
    const upsertCate = await this.categoryRepo.upsert({ name: categoryName });
    return upsertCate;
  }

  async truncate() {
    await this.categoryRepo.truncate();
  }
}
