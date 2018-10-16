import { toPairs } from 'lodash';
import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';
import { URLSearchParams } from 'url';

import config from 'src/config';
import { graphQLMock, graphQLService } from 'src/core/testHelpers';
import snakeCaseObject from 'src/core/utils/snakeCaseObject';

import WebhookEvent from './interfaces/WebhookEvent';
import insertSubscriptions from './queries/insertSubscriptions';
import insertWebhooks from './queries/insertWebhooks';
import StravaService from './StravaService';
import ObjectType from './interfaces/ObjectType';
import AspectType from './interfaces/AspectType';

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
  const json = () => ({
    id: stravaSubscriptionId,
  });

  beforeAll(() => {
    fetchMock.mockReturnValue({
      json,
      status: 201,
      text: () => 'text',
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

  test('saves the subscription', async () => {
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

  test('throws an error if call fails', async () => {
    fetchMock.mockReturnValue({
      json,
      status: 500,
    });

    expect(service.subscribeToWebhooks(data)).rejects.toThrow();
  });
});

describe('saveWebhook', () => {
  const data: WebhookEvent = {
    aspectType: AspectType.Update,
    eventTime: 1516126040,
    objectId: 1360128428,
    objectType: ObjectType.Activity,
    ownerId: 134815,
    subscriptionId: 120475,
    updates: { title: 'Messy' },
  };

  test('saves the webhook', async () => {
    await service.saveWebhook(data);
    expect(graphQLMock.query).toHaveBeenCalledWith(insertWebhooks, {
      objects: [data],
    });
  });
});
