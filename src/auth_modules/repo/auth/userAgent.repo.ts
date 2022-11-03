import { Injectable } from '@nestjs/common';
import { ResponseService } from '../../../nmd_core/shared/response.service';
import {
  UserAgent,
  UserAgentModel,
} from '../../model/userAgent/userAgent.model';
import { IFResponse } from '../../../nmd_core/shared/response.interface';

@Injectable()
export class UserAgentRepo {
  constructor(private readonly responseService: ResponseService) {}

  async insertOrUpdate(item: any) {
    await UserAgent.updateOne(
      {
        userAgent: item.userAgent,
        ip: item.ip,
        accessToken: item.accessToken,
      },
      {
        $inc: { numOfCall: 1, dataTransfer: item.dataTransfer },
        $set: {
          item,
          date: new Date(),
        },
      },
      {
        timestamps: false,
        upsert: true,
        new: true,
      },
    );
    return;
  }

  async findAllAndPaging(
    { page, limit, sort }: { page: number; limit: number; sort?: any },
    filter?: any,
  ): Promise<IFResponse<UserAgentModel>> {
    let skip = 0;
    skip = (page - 1) * limit;

    const userAgents: UserAgentModel[] = await UserAgent.find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort);
    const totalRecords: number = await UserAgent.countDocuments(filter);

    return this.responseService.getResponse<UserAgentModel>(
      userAgents,
      totalRecords,
      +page,
      +limit,
    );
  }
}
