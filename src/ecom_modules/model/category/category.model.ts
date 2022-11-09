import mongoose, { ObjectId, Schema } from 'mongoose';
export class CategoryModel {
  name: string;
  quantity: number;
}

const CategorySchema = new Schema({
  name: { type: String, default: '' },
  quantity: { type: Number, default: 0 },
});

export const Category = mongoose.model<CategoryModel>(
  'Category',
  CategorySchema,
);
