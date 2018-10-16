import * as Koa from 'koa';

const errorHandler: Koa.Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.log.error(err);
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      error: true,
      message: err.expose ? err.toString() : ctx.message,
    };
  }
};

export default errorHandler;
