import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import { IFResponse } from '../../../nmd_core/shared/response.interface';
import { Order, OrderModel } from '../../model/order/order.model';

@Injectable()
export class OrderRepo {
  constructor(private readonly responseService: ResponseService) {}

  async getById(id: string): Promise<OrderModel> {
    const res: OrderModel = await Order.findById({ _id: id }).lean();
    return res;
  }

  async upsert(id: string, item: any): Promise<OrderModel> {
    const order = await Order.findByIdAndUpdate({ _id: id }, item, {
      new: true,
    });
    return order;
  }

  async truncate() {
    await Order.deleteMany({}).catch((e) => console.log(e));
  }

  async create(item: any): Promise<OrderModel> {
    const order = new Order(item);
    await order.save();

    return order;
  }

  async findAllAndPaging(
    { page, limit, sort }: { page: number; limit: number; sort?: any },
    filter?: any,
  ): Promise<IFResponse<OrderModel>> {
    let skip = 0;
    skip = (page - 1) * limit;

    const orders: OrderModel[] = await Order.find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .lean();
    const totalRecords: number = await Order.countDocuments(filter);

    return this.responseService.getResponse<OrderModel>(
      orders,
      totalRecords,
      +page,
      +limit,
    );
  }

  async getAll({}, filter?: any): Promise<OrderModel[]> {
    const orders: OrderModel[] = await Order.find(filter);

    return orders;
  }
}
