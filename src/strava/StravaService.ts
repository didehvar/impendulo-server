import { toPairs } from 'lodash';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

import config from 'src/config';
import camelCaseObject from 'src/core/utils/camelCaseObject';
import snakeCaseObject from 'src/core/utils/snakeCaseObject';
import GraphQLService from 'src/core/GraphQLService';

import CreateSubscription from './interfaces/CreateSubscription';
import Subscription from './interfaces/Subscription';
import insertSubscriptions from './queries/insertSubscriptions';
import WebhookEvent from './interfaces/WebhookEvent';
import insertWebhooks from './queries/insertWebhooks';

class StravaService {
  private graphql: GraphQLService;

  constructor(graphqlSerice: GraphQLService) {
    this.graphql = graphqlSerice;
  }

  async subscribeToWebhooks({
    callbackUrl,
    clientId,
    clientSecret,
    verifyToken,
  }: CreateSubscription) {
    const body = new URLSearchParams(
      toPairs(
        snakeCaseObject({
          callbackUrl,
          clientId,
          clientSecret,
          verifyToken,
        }),
      ),
    );

    const fetchResult = await fetch(
      `${config.STRAVA_API_URL}/push_subscriptions`,
      {
        body,
        method: 'POST',
      },
    );

    if (fetchResult.status !== 201) {
      throw new Error(
        `Call to Strava failed with status ${
          fetchResult.status
        }: ${await fetchResult.text()}`,
      );
    }

    const data = camelCaseObject(await fetchResult.json()) as Subscription;

    return this.graphql.query(insertSubscriptions, {
      objects: [
        {
          callbackUrl,
          clientId,
          stravaSubId: data.id,
        },
      ],
    });
  }

  saveWebhook(event: WebhookEvent) {
    return this.graphql.query(insertWebhooks, {
      objects: [event],
    });
  }
}

export default StravaService;
