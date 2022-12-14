import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { query, Request } from 'express';
import { CreateProductReq, UpdateProductReq } from '../../request';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';
import { ValidationPipe } from '../../../nmd_core/common/pipes/validation.pipe';
import { ReturnInternalServerError } from '../../../nmd_core/common/utils/custom.error';
import { ProductService } from '../../../ecom_modules/service/product.service';
import { PagingPipe } from '../../../nmd_core/common/pipes/paging.pipe';
import { ObjectId } from 'mongoose';

@Controller('/product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly authMiddleWare: AuthMiddleware,
  ) {}

  @Post('/create')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async createProduct(
    @Req() req: Request,
    @Body() createProductReq: CreateProductReq,
  ) {
    try {
      const res = await this.productService.createProduct(createProductReq);

      return {
        statusCode: 200,
        message: 'Create product successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Post('/update')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async updateProduct(
    @Req() req: Request,
    @Body() updateProductReq: UpdateProductReq,
  ) {
    try {
      const res = await this.productService.updateProduct(updateProductReq);

      return {
        statusCode: 200,
        message: 'Update product successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Post('/delete')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async deleteProducts(
    @Req() req: Request,
    @Body()
    removeProductReq: {
      _id: string[];
    },
  ) {
    try {
      const res = await this.productService.deleteProducts(removeProductReq);

      return {
        statusCode: 200,
        message: 'Remove products successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Get('')
  async getProduct(
    @Query(new PagingPipe())
    query: {
      page?: number;
      limit?: number;
      categoryName?: string;
      minPrice?: number;
      maxPrice?: number;
      sort?: string;
    },
  ) {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.productService.getAll(query);
      return {
        statusCode: 200,
        message: 'Get all products info successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Get('/detail')
  async getProductDetail(
    @Query()
    query: {
      id?: ObjectId;
    },
  ) {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.productService.getById(query);
      return {
        statusCode: 200,
        message: 'Get product detail info successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Get('/status')
  async getProductStatus(
    @Query()
    query: {
      page?: number;
      limit?: number;
      categoryName?: string;
      minPrice?: number;
      maxPrice?: number;
      sort?: string;
    },
  ) {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.productService.getStatus(query);
      return {
        statusCode: 200,
        message: 'Get product status info successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Get('/truncate')
  async truncate() {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.productService.truncate();
      return {
        statusCode: 200,
        message: 'Delete all products info successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }
}
