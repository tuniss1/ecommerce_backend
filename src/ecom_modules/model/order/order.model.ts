import mongoose, { ObjectId, Schema } from 'mongoose';
export class OrderModel {
  userId: string;
  products: ProductModel[];
  totalCost: number;
  deliver: DeliverModel;
  note: string;
  status: number; // 0 means pending. 1 is confirmed. 2 is delivering. 3 is finish. 4 is cancelled
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
});

export const Order = mongoose.model<OrderModel>('Order', OrderSchema);
