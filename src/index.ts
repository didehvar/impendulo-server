import * as cors from '@koa/cors';
import 'dotenv/config';
import * as Koa from 'koa';
import * as logger from 'koa-logger';

const app = new Koa();

if (process.env.NODE_ENV === 'development') {
  app.use(logger());
}

app.use(
  cors({
    origin: process.env.APP_URL,
  }),
);

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(process.env.PORT || 3000);
