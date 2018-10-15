import * as cors from '@koa/cors';
import 'dotenv/config';
import * as fs from 'fs';
import * as https from 'https';
import * as Koa from 'koa';
import * as logger from 'koa-logger';

const app = new Koa();

if (process.env.NODE_ENV === 'development') {
  app.use(logger());
}

app.use(
  cors({
    allowHeaders: 'Authorization',
    allowMethods: 'GET,POST',
    origin: process.env.APP_URL,
  }),
);

app.use(async ctx => {
  ctx.body = 'Hello World';
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
