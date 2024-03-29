import { IncomingMessage, ServerResponse } from 'http';
import * as Koa from 'koa';
import fetch from 'node-fetch';
import * as PgBoss from 'pg-boss';
import * as pino from 'pino';
import * as Stream from 'stream';
import { mocked } from 'ts-jest/utils';

import GraphQLService from './GraphQLService';

jest.mock('pino');
jest.mock('pg-boss');
jest.mock('node-fetch');
jest.mock('src/core/GraphQLService');

export const pinoMock = mocked(pino());
export const fetchMock = mocked(fetch);
export const boss = new PgBoss('');
boss.publish = jest.fn(); // i don't get why these are missing send help
export const bossMock = mocked(boss);

export const graphQLService = new GraphQLService(pinoMock as any);
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
