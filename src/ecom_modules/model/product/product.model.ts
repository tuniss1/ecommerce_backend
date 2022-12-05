import mongoose, { ObjectId, Schema } from 'mongoose';
export class ProductModel {
  name: string;
  price: number;
  availability: number;
  vendor: string;
  SKU: string;
  description: string;
  totalQuantity: number;
  images: ImageModel[] | string;
  categoryName: string;
  createdAt: number;
  updatedAt: number;
}

export class ImageModel {
  id: string;
  url: string;
  ref: string;
}

const ProductSchema = new Schema({
  name: { type: String, default: '' },
  price: { type: Number, default: 0 },
  availability: { type: Number, default: 0 },
  vendor: { type: String, default: '' },
  SKU: { type: String, default: '' },
  description: { type: String, default: '' },
  totalQuantity: { type: Number, default: 0 },
  images: [
    {
      type: Object,
      default: {
        id: { type: String, default: '' },
        url: { type: String, default: '' },
        ref: { type: String, default: '' },
      },
    },
  ],
  categoryName: { type: String },
  createdAt: { type: Number, default: new Date().getTime() },
  updatedAt: { type: Number, default: new Date().getTime() },
});

export const Product = mongoose.model<ProductModel>('Product', ProductSchema);
