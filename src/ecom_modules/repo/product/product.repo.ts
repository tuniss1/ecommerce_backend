import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { IFResponse } from '../../../nmd_core/shared/response.interface';
import { Product, ProductModel } from '../../model/product/product.model';

@Injectable()
export class ProductRepo {
  constructor(private readonly responseService: ResponseService) {}

  async getById(id: ObjectId | string): Promise<ProductModel> {
    const res: ProductModel = await Product.findById({ _id: id }).lean();
    return res;
  }

  async upsert(id: string, item: any): Promise<ProductModel> {
    const product = await Product.findByIdAndUpdate({ _id: id }, item, {
      new: true,
    });
    return product;
  }

  async remove(id: string): Promise<ProductModel> {
    const product = await Product.findByIdAndDelete({ _id: id });
    return product;
  }

  async updateCategory(item: any, filter: any): Promise<ProductModel[]> {
    const products: ProductModel[] = await Product.updateMany(filter, item, {
      new: true,
    }).lean();

    return products;
  }

  async truncate() {
    await Product.deleteMany({}).catch((e) => console.log(e));
  }

  async create(item: any): Promise<ProductModel> {
    const product = new Product(item);
    await product.save();

    return product;
  }

  async findAllAndPaging(
    { page, limit, sort }: { page: number; limit: number; sort?: any },
    filter?: any,
  ): Promise<IFResponse<ProductModel>> {
    let skip = 0;
    skip = (page - 1) * limit;

    const products: ProductModel[] = await Product.find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort);
    const totalRecords: number = await Product.countDocuments(filter);

    return this.responseService.getResponse<ProductModel>(
      products,
      totalRecords,
      +page,
      +limit,
    );
  }

  async getAll({}, filter?: any): Promise<ProductModel[]> {
    const products: ProductModel[] = await Product.find(filter);

    return products;
  }
}
