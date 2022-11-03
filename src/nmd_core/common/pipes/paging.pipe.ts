import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ReturnBadRequestException } from '../utils/custom.error';

@Injectable()
export class PagingPipe implements PipeTransform<any, any> {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (
      (value.page && isNaN(value.page)) ||
      (value.limit && isNaN(value.limit))
    )
      throw ReturnBadRequestException('Page and limit should be number');

    value.page = value.page ? parseInt(value.page, 10) : value.page;
    value.limit = value.limit ? parseInt(value.limit, 10) : value.limit;

    return value;
  }
}
