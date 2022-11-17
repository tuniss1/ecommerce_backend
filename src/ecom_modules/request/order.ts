import { ObjectId } from 'mongoose';

export class CreateOrderReq {
  userId: string;
  products: ProductModel[];
  totalCost: number;
  deliver: DeliverModel;
  note: string;
}

class ProductModel {
  _id: ObjectId;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

class DeliverModel {
  location: string;
  fee: number;
}

export class GetOrderDetailReq {
  userId: string;
  orderId: string;
}

export class GetOrderListReq {
  userId: string;
  page: number;
  limit: number;
  status?: number;
}

export class GetOrderStatusReq {
  userId: string;
  status: number;
}

export class UpdateOrderReq {
  userId: string;
  orderId: string;
  status: number;
}
