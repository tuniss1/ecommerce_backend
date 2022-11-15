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
import { CreateOrderReq } from '../../request';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';
import { ValidationPipe } from '../../../nmd_core/common/pipes/validation.pipe';
import { ReturnInternalServerError } from '../../../nmd_core/common/utils/custom.error';
import { OrderService } from '../../../ecom_modules/service/order.service';
import { PagingPipe } from '../../../nmd_core/common/pipes/paging.pipe';

@Controller('/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly authMiddleWare: AuthMiddleware,
  ) {}

  @Post('/create')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async createOrder(
    @Req() req: Request,
    @Body() createOrderReq: CreateOrderReq,
  ) {
    try {
      const res = await this.orderService.createOrder(createOrderReq);

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
  async getOrderDetail(
    @Query()
    query: {
      orderId?: string;
    },
  ) {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.orderService.getById(query.orderId);
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

  @Get('/list')
  async getOrderList(
    @Query(new PagingPipe())
    query: {
      userId?: string;
      orderId?: string;
      page?: number;
      limit?: number;
      status?: number;
    },
  ) {
    // await this.authMiddleWare.validateBearer(req);
    // orderId is like search field
    try {
      const res = await this.orderService.getAll(query);
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
      userId?: string;
      status?: number;
    },
  ) {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.orderService.getStatus(query);
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
