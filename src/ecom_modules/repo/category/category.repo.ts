import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { Category, CategoryModel } from '../../model/category/category.model';

@Injectable()
export class CategoryRepo {
  constructor(private readonly responseService: ResponseService) {}

  async upsert(item: any): Promise<CategoryModel> {
    const category = await Category.findOneAndUpdate(
      { name: item.name },
      { $inc: { quantity: 1 } },
      { new: true, upsert: true },
    );
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

  async getAll(): Promise<CategoryModel[]> {
    const categories: CategoryModel[] = await Category.find();

    return categories;
  }
}
