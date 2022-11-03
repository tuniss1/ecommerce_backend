export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      nodeEnvironment: process.env.NODE_ENV,
      jwtKey: process.env.JWT_KEY,
      tokenExpireIn: process.env.TOKEN_EXPIREIN,
      connectionString: process.env.CONNECTION_STRING,
      connectionStringProd: process.env.CONNECTION_STRING_PROD,
      mailAddress: process.env.MAIL_ADDRESS,
      mailPassword: process.env.MAIL_PASSWORD,
      firebaseURL: process.env.FIREBASE_URL,
      firebaseToken: process.env.FIREBASE_TOKEN,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
