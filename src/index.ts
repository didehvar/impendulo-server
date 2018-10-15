import * as cors from '@koa/cors';
import 'dotenv/config';
import * as fs from 'fs';
import { graphql } from 'graphql';
import * as https from 'https';
import * as Koa from 'koa';
import * as helmet from 'koa-helmet';
import * as logger from 'koa-logger';
import * as enforceHttps from 'koa-sslify';

import makeSchema from './schema';

const bootstrap = async () => {
  const app = new Koa();
  const schema = await makeSchema();

  if (process.env.NODE_ENV === 'development') {
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
      origin: process.env.APP_URL,
    }),
  );

  app.use(async ctx => {
    const query = `{
      users {
        id
        email
        firstname
      }
    }`;
    const result = await graphql(schema, query);
    ctx.body = result;
  });

  if (process.env.HTTPS) {
    https
      .createServer(
        {
          cert: fs.readFileSync('keys/local.crt'),
          key: fs.readFileSync('keys/local.key'),
        },
        app.callback(),
      )
      .listen(process.env.PORT);
  } else {
    app.listen(process.env.PORT);
  }
};

bootstrap();
