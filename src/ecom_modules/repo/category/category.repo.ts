import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { Category, CategoryModel } from '../../model/category/category.model';
import { IFResponse } from '../../../nmd_core/shared/response.interface';

@Injectable()
export class CategoryRepo {
  constructor(private readonly responseService: ResponseService) {}

  async upsert(item: any, quantity: number): Promise<CategoryModel> {
    const category = await Category.findOneAndUpdate(
      { name: item.name },
      { $inc: { quantity: quantity } },
      { new: true },
    );
    return category;
  }

  async updateName(id: string, name: any): Promise<CategoryModel> {
    const category = await Category.findByIdAndUpdate(
      { _id: id },
      { name: name },
    ).lean();
    return category;
  }

  async remove(id: string): Promise<CategoryModel> {
    const category = await Category.findByIdAndDelete({ _id: id });
    return category;
  }

  async truncate() {
    await Category.deleteMany({}).catch((e) => console.log(e));
  }

  async create(item: any): Promise<CategoryModel> {
    const category = new Category(item);
    await category.save();

    return category;
  }

  async findAllAndPaging(
    { page, limit, sort }: { page: number; limit: number; sort?: any },
    filter?: any,
  ): Promise<IFResponse<CategoryModel>> {
    let skip = 0;
    skip = (page - 1) * limit;

    const categories: CategoryModel[] = await Category.find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort);
    const totalRecords: number = await Category.countDocuments(filter);

    return this.responseService.getResponse<CategoryModel>(
      categories,
      totalRecords,
      +page,
      +limit,
    );
  }

  async getAll(): Promise<CategoryModel[]> {
    const categories: CategoryModel[] = await Category.find();

    return categories;
  }

  async getById(id: string): Promise<CategoryModel> {
    const category: CategoryModel = await Category.findById({ _id: id });

    return category;
  }
}
