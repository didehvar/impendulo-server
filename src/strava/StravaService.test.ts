import { toPairs } from 'lodash';
import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';
import { URLSearchParams } from 'url';

import config from 'src/config';
import { graphQLMock, graphQLService } from 'src/core/testHelpers';
import snakeCaseObject from 'src/core/utils/snakeCaseObject';

import insertSubscriptions from './queries/insertSubscriptions';
import StravaService from './StravaService';

jest.mock('node-fetch');

const fetchMock = mocked(fetch);
const service = new StravaService(graphQLService);

describe('subscribe', () => {
  const stravaSubscriptionId = 1;
  const data = {
    callbackUrl: 'http://wicked-callback.com/callback',
    clientId: 5,
    clientSecret: 'abcdefimasecretghijklmnop',
    verifyToken: 'verifymepls',
  };

  beforeAll(() => {
    fetchMock.mockReturnValue({
      json: () => ({
        id: stravaSubscriptionId,
      }),
      status: 200,
    });
  });

  test('subscribes to strava', async () => {
    const body = new URLSearchParams(toPairs(snakeCaseObject(data)));

    await service.subscribeToWebhooks(data);

    expect(fetchMock).toHaveBeenCalledWith(
      `${config.STRAVA_API_URL}/push_subscriptions`,
      {
        body,
        method: 'POST',
      },
    );
  });

  test('saves the webhook', async () => {
    await service.subscribeToWebhooks(data);

    expect(graphQLMock.query).toHaveBeenCalledWith(insertSubscriptions, {
      objects: [
        {
          callbackUrl: data.callbackUrl,
          clientId: data.clientId,
          stravaSubId: stravaSubscriptionId,
        },
      ],
    });
  });
});
