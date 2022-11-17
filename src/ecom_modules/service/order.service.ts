import { Injectable } from '@nestjs/common';
import { ReturnNotFoundException } from '../../nmd_core/common/utils/custom.error';
import { OrderRepo, UserRepo } from '../repo';
import { CreateOrderReq } from '../request';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly userRepo: UserRepo,
  ) {}

  async createOrder(createOrderReq: CreateOrderReq) {
    const user = await this.userRepo.getByIdString(createOrderReq.userId);
    if (!user) throw ReturnNotFoundException('Invalid user.');

    // create deliver

    // create order
    const newOrder = await this.orderRepo.create(createOrderReq);
    return newOrder;
  }

  async getById({ userId, orderId }: { userId?: string; orderId?: string }) {
    const res = await this.orderRepo.getById(orderId).catch((e) => {
      throw ReturnNotFoundException('Invalid user or order.');
    });

    if (!res || res.userId !== userId)
      throw ReturnNotFoundException('Invalid user or order.');
    return res;
  }

  async getAll({
    page,
    limit,
    userId,
    status,
  }: {
    userId?: string;
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

    const filter = {
      userId: userId,
    };

    if (status && status != -1) filter['status'] = status;

    const res = await this.orderRepo.findAllAndPaging(
      { page, limit, sort: {} },
      filter,
    );

    return { listRoom: res };
  }

  async updateStatus({
    userId,
    orderId,
    status,
  }: {
    orderId?: string;
    userId?: string;
    status?: number;
  }) {
    if (!status || status < 0) throw ReturnNotFoundException('Invalid status.');
    const updateItem = {
      status,
    };

    const order = await this.orderRepo.getById(orderId);
    if (!order || order.userId != userId)
      throw ReturnNotFoundException('Invalid order id or user.');

    const res = await this.orderRepo.upsert(orderId, updateItem);

    return { listRoom: res };
  }

  async getStatus({ userId, status }: { userId?: string; status?: number }) {
    const filter = {
      userId,
    };

    if (status && status != -1) filter['status'] = status;

    let res = await this.orderRepo.getAll({}, filter);
    return { count: res.length };
  }
}
