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
import { CreateProductReq } from '../../request';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';
import { ValidationPipe } from '../../../nmd_core/common/pipes/validation.pipe';
import { ReturnInternalServerError } from '../../../nmd_core/common/utils/custom.error';
import { ProductService } from '../../../ecom_modules/service/product.service';
import { PagingPipe } from '../../../nmd_core/common/pipes/paging.pipe';

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

  @Get('')
  async getProduct(
    @Query(new PagingPipe())
    query: {
      page?: number;
      limit?: number;
      categoryName?: string;
      minPrice?: number;
      maxPrice?: number;
    },
  ) {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.productService.getAll(query);
      return {
        statusCode: 200,
        message: 'Get all product info successfully',
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
      categoryName?: string;
      minPrice?: number;
      maxPrice?: number;
    },
  ) {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.productService.getStatus(query);
      return {
        statusCode: 200,
        message: 'Get all product info successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }
}
