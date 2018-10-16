import { mocked } from 'ts-jest/utils';

import config from 'src/config';
import { createContext, graphQLService, mockNext } from 'src/core/testHelpers';

import StravaController from './StravaController';
import StravaService from './StravaService';

jest.mock('./StravaService');

const stravaService = new StravaService(graphQLService);
const serviceMock = mocked(stravaService);
const controller = new StravaController(stravaService);

describe('subscribe', () => {
  const hostname = 'http://wicked-callback.com/callback';
  const context = Object.assign({ hostname }, createContext());
  config.STRAVA_CLIENT_ID = 5;
  config.STRAVA_CLIENT_SECRET = 'abcdefimasecretghijklmnop';
  config.STRAVA_CALLBACK_URL = 'callbackUrl';
  config.STRAVA_VERIFY_TOKEN = 'verifymepls';

  test('subscribes to webhooks', async () => {
    await controller.subscribe(context, mockNext);

    expect(serviceMock.subscribeToWebhooks).toHaveBeenCalledWith({
      callbackUrl: config.STRAVA_CALLBACK_URL,
      clientId: config.STRAVA_CLIENT_ID,
      clientSecret: config.STRAVA_CLIENT_SECRET,
      verifyToken: config.STRAVA_VERIFY_TOKEN,
    });
  });
});

describe('verifyWebhook', () => {
  const hubChallenge = 'achallengerhasappeared';
  const verifyToken = 'verifymepls';
  const query = {
    'hub.challenge': hubChallenge,
    'hub.verify_token': verifyToken,
  };
  const context = Object.assign({ query }, createContext());
  config.STRAVA_VERIFY_TOKEN = verifyToken;

  test('responds with hub challenge', () => {
    controller.verifyWebhook(context, mockNext);
    expect(context.body).toEqual({ 'hub.challenge': hubChallenge });
  });

  test('errors if the verify token does not match', () => {
    config.STRAVA_VERIFY_TOKEN = 'notthetoken';
    expect(() => controller.verifyWebhook(context, mockNext)).toThrow();
  });
});
