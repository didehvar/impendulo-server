import { IncomingMessage, ServerResponse } from 'http';
import * as Koa from 'koa';
import * as Stream from 'stream';
import { mocked } from 'ts-jest/utils';

import GraphQLService from './GraphQLService';

jest.mock('src/core/GraphQLService');

export const graphQLService = new GraphQLService();
export const graphQLMock = mocked(graphQLService);

export const mockNext = () => Promise.resolve();

// https://github.com/koajs/koa/blob/master/test/helpers/context.js
export const createContext = (
  req?: IncomingMessage,
  res?: ServerResponse,
  app?: Koa,
) => {
  const socket = new Stream.Duplex();
  req = Object.assign({ headers: {}, socket }, Stream.Readable.prototype, req);
  res = Object.assign({ _headers: {}, socket }, Stream.Writable.prototype, res);
  (req.socket as any).remoteAddress = req.socket.remoteAddress || '127.0.0.1';
  app = app || new Koa();
  res.getHeader = k => (res as any)._headers[k.toLowerCase()];
  res.setHeader = (k, v) => ((res as any)._headers[k.toLowerCase()] = v);
  res.removeHeader = k => {
    delete (res as any)._headers[k.toLowerCase()];
  };
  return app.createContext(req, res);
};
