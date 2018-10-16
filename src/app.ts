import * as cors from '@koa/cors';
import 'dotenv/config';
import * as fs from 'fs';
import * as https from 'https';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as helmet from 'koa-helmet';
import * as logger from 'koa-logger';
import * as enforceHttps from 'koa-sslify';

import config from './config';

const bootstrap = async () => {
  const app = new Koa();
  app.proxy = true;

  if (config.NODE_ENV === 'development') {
    app.use(logger());
  }

  app.use(helmet());
  app.use(
    enforceHttps({
      trustProtoHeader: true,
    }),
  );
  app.use(
    cors({
      allowHeaders: 'Authorization',
      allowMethods: 'GET,POST',
      origin: config.APP_URL,
    }),
  );
  app.use(bodyParser());

  if (config.HTTPS) {
    https
      .createServer(
        {
          cert: fs.readFileSync('keys/local.crt'),
          key: fs.readFileSync('keys/local.key'),
        },
        app.callback(),
      )
      .listen(config.PORT);
  } else {
    app.listen(config.PORT);
  }
};

export default bootstrap;
