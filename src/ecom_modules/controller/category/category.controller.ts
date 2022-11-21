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
import { CreateCategoryReq } from '../../request';
import { AuthMiddleware } from '../../../nmd_core/common/middlewares/bearer.middleware';
import { ValidationPipe } from '../../../nmd_core/common/pipes/validation.pipe';
import { ReturnInternalServerError } from '../../../nmd_core/common/utils/custom.error';
import { CategoryService } from '../../service/category.service';
import { PagingPipe } from '../../../nmd_core/common/pipes/paging.pipe';

@Controller('/category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly authMiddleWare: AuthMiddleware,
  ) {}

  @Post('/create')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async createCategory(
    @Req() req: Request,
    @Body() createCategoryReq: CreateCategoryReq,
  ) {
    try {
      const res = await this.categoryService.createCategory(createCategoryReq);

      return {
        statusCode: 200,
        message: 'Create category successfully',
        data: res,
      };
    } catch (error) {
      if (error.status) throw error;
      else throw ReturnInternalServerError(error);
    }
  }

  @Get('')
  async getCategory() {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.categoryService.getAll();
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

  @Get('/truncate')
  async truncate() {
    // await this.authMiddleWare.validateBearer(req);

    try {
      const res = await this.categoryService.truncate();
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
