import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { Category, CategoryModel } from '../../model/category/category.model';

@Injectable()
export class CategoryRepo {
  constructor(private readonly responseService: ResponseService) {}

  async upsert(id: ObjectId, item: any): Promise<CategoryModel> {
    const category = await Category.findByIdAndUpdate({ _id: id }, item, {
      new: true,
      upsert: true,
    });
    return category;
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
