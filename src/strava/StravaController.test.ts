import { mocked } from 'ts-jest/utils';

import config from 'src/config';
import { createContext, graphQLService } from 'src/core/testHelpers';

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
  config.STRAVA_VERIFY_TOKEN = 'verifymepls';

  test('subscribes to webhooks', () => {
    controller.subscribe(context);

    expect(serviceMock.subscribeToWebhooks).toHaveBeenCalledWith({
      callbackUrl: hostname,
      clientId: config.STRAVA_CLIENT_ID,
      clientSecret: config.STRAVA_CLIENT_SECRET,
      verifyToken: config.STRAVA_VERIFY_TOKEN,
    });
  });
});
