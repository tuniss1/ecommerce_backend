import mongoose, { ObjectId, Schema } from 'mongoose';
export class OrderModel {
  userId: string;
  products: ProductModel[];
  totalCost: number;
  deliver: DeliverModel;
  note: string;
  status: number; // 0 means pending. 1 is paid. 2 is confirmed. 3 is delivering. 4 is finish. 5 is cancelled
  createdAt: number;
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

const OrderSchema = new Schema({
  userId: { type: String, default: '' },
  totalCost: { type: Number, default: 0 },
  note: { type: String, default: '' },
  status: { type: Number, default: 0 },
  products: [{ type: Object, default: {} }],
  deliver: { type: Object, default: {} },
  createdAt: { type: Number, default: new Date().getTime() },
});

export const Order = mongoose.model<OrderModel>('Order', OrderSchema);
