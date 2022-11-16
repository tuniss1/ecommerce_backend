import { Injectable } from '@nestjs/common';
import { OrderRepo } from '../repo';
import { CreateOrderReq } from '../request';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepo: OrderRepo) {}

  async createOrder(createOrderReq: CreateOrderReq) {
    const newOrder = await this.orderRepo.create(createOrderReq);
    return newOrder;
  }

  async getById(orderId: string) {
    const res = await this.orderRepo.getById(orderId);
    return res;
  }

  async getAll({
    page,
    limit,
    userId,
    orderId,
    status,
  }: {
    userId?: string;
    orderId?: string;
    page?: number;
    limit?: number;
    status?: number;
  }) {
    if (!page || page <= 0) {
      page = 1;
    }
    if (!limit) {
      limit = 20;
    }

    const callback = (err?: any, docs?: any) => {
      const res = [];
      if (docs) {
        for (const doc of docs) {
          if (orderId !== null && doc._id.includes(orderId)) {
            res.push(doc);
          }
        }
      }
      return res;
    };

    const filter = {
      userId: userId,
    };

    if (status !== -1) filter['status'] = status;

    const res = await this.orderRepo.findAllAndPaging(
      { page, limit, sort: {} },
      filter,
      callback,
    );

    return { listRoom: res };
  }

  async getStatus({ userId, status }: { userId?: string; status?: number }) {
    let res = await this.orderRepo.getAll(
      {},
      {
        userId: userId,
        status: status,
      },
    );
    return { count: res.length };
  }
}
