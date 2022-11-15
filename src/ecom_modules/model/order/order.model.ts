import mongoose, { ObjectId, Schema } from 'mongoose';
import { ProductModel } from '../product/product.model';
export class OrderModel {
  userId: string;
  products: ProductModel[];
  totalCost: number;
  deliver: DeliverModel;
  note: string;
  status: number;
}

class DeliverModel {
  location: string;
  fee: number;
}

const OrderSchema = new Schema({
  userId: { type: String, default: '' },
  totalCost: { type: Number, default: 0 },
  note: { type: String, default: '' },
  status: { type: Number, default: 0 },
  products: [{ type: Object, default: {} }],
  deliver: { type: Object, default: {} },
});

export const Order = mongoose.model<OrderModel>('Order', OrderSchema);
