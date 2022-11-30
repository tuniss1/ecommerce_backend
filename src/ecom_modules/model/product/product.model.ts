import mongoose, { ObjectId, Schema } from 'mongoose';
export class ProductModel {
  name: string;
  price: number;
  availability: number;
  vendor: string;
  SKU: string;
  description: string;
  totalQuantity: number;
  images: string[];
  categoryName: string;
  createdAt: number;
  updatedAt: number;
}

const ProductSchema = new Schema({
  name: { type: String, default: '' },
  price: { type: Number, default: 0 },
  availability: { type: Number, default: 0 },
  vendor: { type: String, default: '' },
  SKU: { type: String, default: '' },
  description: { type: String, default: '' },
  totalQuantity: { type: Number, default: 0 },
  images: [{ type: String }],
  categoryName: { type: String },
  createdAt: { type: Number, default: new Date().getTime() },
  updatedAt: { type: Number, default: new Date().getTime() },
});

export const Product = mongoose.model<ProductModel>('Product', ProductSchema);
