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
import {
  CreateOrderReq,
  GetOrderDetailReq,
  GetOrderListReq,
  GetOrderStatusReq,
  UpdateOrderReq,
} from '../../request';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';
import { ValidationPipe } from '../../../nmd_core/common/pipes/validation.pipe';
import { ReturnInternalServerError } from '../../../nmd_core/common/utils/custom.error';
import { OrderService } from '../../../ecom_modules/service/order.service';
import { PagingPipe } from '../../../nmd_core/common/pipes/paging.pipe';
import { ObjectId } from 'mongoose';

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
        message: 'Create order successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Post('')
  async getOrderDetail(
    @Req() req: Request,
    @Body() getOrderDetailReq: GetOrderDetailReq,
  ) {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.orderService.getById(getOrderDetailReq);
      return {
        statusCode: 200,
        message: 'Get order detail info successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Post('/list')
  async getOrderList(
    @Req() req: Request,
    @Body() getOrderListReq: GetOrderListReq,
  ) {
    // await this.authMiddleWare.validateBearer(req);
    // orderId is like search field
    try {
      const res = await this.orderService.getAll(getOrderListReq);
      return {
        statusCode: 200,
        message: 'Get all order info successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Post('/update')
  async updateOrderStatus(
    @Req() req: Request,
    @Body() updateOrderReq: UpdateOrderReq,
  ) {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.orderService.updateStatus(updateOrderReq);
      return {
        statusCode: 200,
        message: 'Update order successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Post('/status')
  async getOrderStatus(
    @Req() req: Request,
    @Body() getOrderStatusReq: GetOrderStatusReq,
  ) {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.orderService.getStatus(getOrderStatusReq);
      return {
        statusCode: 200,
        message: 'Get order status info successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }
}
