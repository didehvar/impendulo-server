import * as Koa from 'koa';
import config from 'src/config';
import camelCaseObject from 'src/core/utils/camelCaseObject';

import VerifyWebhook from './interfaces/VerifyWebhook';
import { StravaWebhookEvent } from './interfaces/WebhookEvent';
import StravaService from './StravaService';

class StravaController {
  private service: StravaService;

  constructor(stravaService: StravaService) {
    this.service = stravaService;
  }

  subscribe: Koa.Middleware = async ctx => {
    ctx.body = await this.service.subscribeToWebhooks({
      callbackUrl: config.STRAVA_CALLBACK_URL,
      clientId: config.STRAVA_CLIENT_ID,
      clientSecret: config.STRAVA_CLIENT_SECRET,
      verifyToken: config.STRAVA_VERIFY_TOKEN,
    });
  };

  verifyWebhook: Koa.Middleware = ctx => {
    const hub: VerifyWebhook = camelCaseObject(ctx.query);

    if (hub.hubVerifyToken !== config.STRAVA_VERIFY_TOKEN) {
      ctx.throw(401);
    }

    ctx.body = {
      'hub.challenge': hub.hubChallenge,
    };
  };

  webhook: Koa.Middleware = async ctx => {
    const event: StravaWebhookEvent = camelCaseObject(ctx.request.body);
    ctx.body = await this.service.saveWebhook({
      ...event,
      eventTime: new Date(event.eventTime * 1000).toISOString(),
    });
  };
}

export default StravaController;
