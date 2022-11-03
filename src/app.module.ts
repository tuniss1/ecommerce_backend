import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from './nmd_core/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './nmd_core/common/middlewares/logger.middleware';
import { UserAgentModule } from './auth_modules/model/userAgent/userAgent.module';
import { join } from 'path';
import { DatabaseModule } from './nmd_core/database';
import { EcomModule } from './ecom_modules/ecom.module';

@Module({
  imports: [
    ConfigModule,
    EventEmitterModule.forRoot(),
    DatabaseModule,
    UserAgentModule,
    ServeStaticModule.forRoot({
      rootPath: join(`${__dirname}api/`, '..', 'files'),
      serveRoot: '/api/files',
      exclude: ['/api*'],
    }),

    // BkEModule,
    EcomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // authorize file token
    //consumer.apply(AuthMiddleware).exclude('/files').forRoutes('*');
  }
}
