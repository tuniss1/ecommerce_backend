import mongoose, { ObjectId, Schema } from 'mongoose';
export class CategoryModel {
  name: string;
  quantity: number;
  createdAt: number;
}

const CategorySchema = new Schema({
  name: { type: String, default: '' },
  quantity: { type: Number, default: 0 },
  createdAt: { type: Number, default: new Date().getTime() },
});

export const Category = mongoose.model<CategoryModel>(
  'Category',
  CategorySchema,
);
