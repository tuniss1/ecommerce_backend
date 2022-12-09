import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { CategoryRepo } from '../repo';
import { CreateCategoryReq } from '../request';
import { ProductService } from './product.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepo,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  async createCategory(createCategoryReq: CreateCategoryReq) {
    const newCategory = await this.categoryRepo.create(createCategoryReq);
    return newCategory;
  }

  async getById({ _id }: { _id: string }) {
    const category = await this.categoryRepo.getById(_id);
    return { data: category };
  }

  async updateCategory({ _id, name }: { _id: string; name: string }) {
    const prevCategory = await this.categoryRepo
      .updateName(_id, name)
      .catch((e) => {
        console.log('update error ' + e);
      });
    if (typeof prevCategory !== 'undefined') {
      await this.productService
        .updateCategory(prevCategory.name, name)
        .catch((e) => {
          console.log('update prod error ' + e);
        });
    }

    return { ...prevCategory, name: name };
  }

  async deleteCategories({ _id }: { _id: string[] }) {
    const res = [];
    for (const id of _id) {
      res.push(await this.categoryRepo.remove(id));
      await this.productService.updateCategory(res[res.length - 1].name, '');
    }

    return { listRoom: res };
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

  async upsert(categoryName: string, quantity: number) {
    const upsertCate = await this.categoryRepo.upsert(
      { name: categoryName },
      quantity,
    );
    return upsertCate;
  }

  async truncate() {
    await this.categoryRepo.truncate();
  }
}
