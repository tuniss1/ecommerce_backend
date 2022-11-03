import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as requestIp from 'request-ip';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { GlobalService } from './nmd_core/shared/globalVar.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // setup firebase
  const adminConfig: ServiceAccount = {
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.CLIENT_EMAIL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });

  const db = admin.firestore();
  GlobalService.globalDb = db;
  // end of setup firebase

  // setup cors
  app.enableCors();
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
  // end of config cors

  app.setGlobalPrefix('api');
  app.use(requestIp.mw());

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, () => {
    console.log('listening on port ' + port);
  });
}
bootstrap();
