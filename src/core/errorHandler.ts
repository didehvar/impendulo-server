import * as Koa from 'koa';

const errorHandler: Koa.Middleware = async (ctx, next) => {
  try {
    const result = await next();
    console.log('result', result);
  } catch (err) {
    ctx.log.error(err);
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      error: true,
      message: err.message,
    };
  }
};

export default errorHandler;
