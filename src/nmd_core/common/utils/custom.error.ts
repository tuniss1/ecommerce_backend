import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

export function ReturnBadRequestException(error: string) {
  return new BadRequestException({ statusCode: 400, error: error });
}

export function ReturnNotFoundException(error: string) {
  return new NotFoundException({ statusCode: 404, error: error });
}

export function ReturnInternalServerError(error: any) {
  // cast _id fail
  if (error.toString().includes('ObjectId failed')) {
    return ReturnBadRequestException('_id is not valid (ObjectId)');
  } else {
    console.log('>>>>>>> 500: ', error);
    return new InternalServerErrorException({
      statusCode: 500,
      error: 'Internal server error',
    });
  }
}

export function ReturnUnauthorizedException() {
  return new UnauthorizedException({
    statusCode: 401,
    error: 'Unauthorized Exception',
  });
}
