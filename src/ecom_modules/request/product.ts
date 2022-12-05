import { ImageModel } from '../model/product/product.model';

export class CreateProductReq {
  name: string;
  price: number;
  availability: number;
  vendor: string;
  SKU: string;
  description: string;
  totalQuantity: number;
  images: string[] | ImageModel[];
  categoryName: string;
}
export class UpdateProductReq {
  _id: string;
  name: string;
  price: number;
  availability: number;
  vendor: string;
  SKU: string;
  description: string;
  totalQuantity: number;
  images: string[] | ImageModel[];
  categoryName: string;
}
