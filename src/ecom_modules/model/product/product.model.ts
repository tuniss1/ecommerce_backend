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
  category: Category;
}

class Category {
  id: number;
  name: string;
  quantity: number;
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
  category: { type: Object },
});

export const Product = mongoose.model<ProductModel>('Product', ProductSchema);
