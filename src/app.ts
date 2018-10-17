import * as cors from '@koa/cors';
import 'dotenv/config';
import * as fs from 'fs';
import * as https from 'https';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as helmet from 'koa-helmet';
import * as devLogger from 'koa-logger';
// import * as enforceHttps from 'koa-sslify';
import * as pino from 'pino';

import config from './config';
import errorHandler from './core/errorHandler';
import createRouter from './routes';

const bootstrap = async () => {
  const loggerOptions = { prettyPrint: config.DEV };
  const logger = pino(loggerOptions);

  const app = new Koa();

  app.context.log = logger;
  app.proxy = true;

  app.use(errorHandler);

  if (config.DEV) {
    app.use(devLogger());
  }

  // if (config.PROD) {
  //   app.use(
  //     enforceHttps({
  //       trustProtoHeader: true,
  //     }),
  //   );
  // }

  app.use(helmet());

  app.use(
    cors({
      allowHeaders: 'Authorization',
      allowMethods: 'GET,POST',
      origin: config.APP_URL,
    }),
  );
  app.use(bodyParser());

  try {
    const router = await createRouter(logger);
    app.use(router.routes());
  } catch (ex) {
    logger.fatal(ex, 'Failed to init router');
  }

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
