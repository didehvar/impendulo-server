import * as pino from 'pino';

declare module 'koa' {
  interface BaseContext {
    log: pino.Logger;
  }
}
