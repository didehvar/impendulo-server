import * as Koa from 'koa';
import { ComposedMiddleware } from 'koa-compose';

import config from 'src/config';

import StravaService from './StravaService';

class StravaController {
  private service: StravaService;

  constructor(stravaService: StravaService) {
    this.service = stravaService;
  }

  subscribe: ComposedMiddleware<Koa.Context> = async ctx => {
    await this.service.subscribeToWebhooks({
      callbackUrl: ctx.hostname,
      clientId: config.STRAVA_CLIENT_ID,
      clientSecret: config.STRAVA_CLIENT_SECRET,
      verifyToken: config.STRAVA_VERIFY_TOKEN,
    });
  };
}

export default StravaController;
