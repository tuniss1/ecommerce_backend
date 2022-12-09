import { Injectable } from '@nestjs/common';
import { ReturnNotFoundException } from '../../nmd_core/common/utils/custom.error';
import { OrderRepo, UserRepo } from '../repo';
import { CreateOrderReq } from '../request';
import { createHmac } from 'crypto';
import { stringify, unescape } from 'querystring';

function sortObject(obj: Object): any {
  let sorted = {};
  let str = [];
  let key: any;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

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
    return {
      data: newOrder,
    };
  }

  async createPayment({
    orderId,
    totalCost,
  }: {
    orderId: string;
    totalCost?: number;
  }) {
    // create deliver

    // create payment
    const vnp_Config = {
      vnp_TmnCode: '74M7MB5Y',
      vnp_HashSecret: 'BBMEFBKDFWNULZGHAWNYOZNRUBGUGTWM',
      vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      vnp_ReturnUrl: 'http://localhost:3000/checkout/order-complete',
    };

    let vnpUrl = vnp_Config.vnp_Url;

    const createDate = new Date()
      .toISOString()
      .split('.')[0]
      .replace(/[^\d]/gi, '');
    // const orderId = new Date()
    //   .toTimeString()
    //   .split(' ')[0]
    //   .replace(':', '')
    //   .replace(':', '');

    let vnp_Params = {
      vnp_Amount: Number(totalCost * 20000 * 100).toString(),
      vnp_BankCode: 'NCB',
      vnp_Command: 'pay',
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '%3A%3A1',
      vnp_Locale: 'en',
      vnp_OrderInfo: 'Payment+for+Dragon+fish+sotre',
      vnp_OrderType: 'billpayment',
      vnp_ReturnUrl: vnp_Config.vnp_ReturnUrl,
      vnp_TmnCode: '74M7MB5Y',
      vnp_TxnRef: orderId,
      vnp_Version: '2.1.0',
    };

    vnp_Params = sortObject(vnp_Params);

    const signData = unescape(stringify(vnp_Params));
    let hmac = createHmac('sha512', vnp_Config.vnp_HashSecret);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + unescape(stringify(vnp_Params));

    return {
      url: vnpUrl,
    };
  }

  async getById({ userId, orderId }: { userId?: string; orderId?: string }) {
    const order = await this.orderRepo.getById(orderId).catch((e) => {
      throw ReturnNotFoundException('Invalid user or order.');
    });

    if (!order || (userId && order.userId !== userId))
      throw ReturnNotFoundException('Invalid user or order.');

    const userObj = await this.userRepo.getByIdString(order.userId);
    return {
      ...order,
      customer: {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
      },
    };
  }

  async truncate() {
    await this.orderRepo.truncate();
  }

  async getAll({
    page,
    limit,
    userId,
    status,
    sort,
  }: {
    userId?: string;
    page?: number;
    limit?: number;
    status?: number;
    sort?: string;
  }) {
    if (!page || page <= 0) {
      page = 1;
    }
    if (!limit) {
      limit = 20;
    }

    const filter = {};

    if (userId) filter['userId'] = userId;
    if (status && status != -1) filter['status'] = status;

    const sortItem = {};
    if (sort && sort.length) sortItem['createdAt'] = sort;

    const res = await this.orderRepo.findAllAndPaging(
      { page, limit, sort: sortItem },
      filter,
    );

    if (!userId) {
      const userObj = {};
      const returnData = [];
      for (const order of res.data) {
        if (!userObj[order.userId]) {
          userObj[order.userId] = await this.userRepo.getByIdString(
            order.userId,
          );
        }
        returnData.push({
          ...order,
          customer: {
            firstName: userObj[order.userId].firstName,
            lastName: userObj[order.userId].lastName,
          },
        });
      }
      return { listRoom: { data: returnData, meta_data: res.meta_data } };
    }

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
    if (!order || (userId && order.userId != userId))
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
