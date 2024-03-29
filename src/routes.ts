import * as KoaRouter from 'koa-router';
import * as PgBoss from 'pg-boss';
import * as pino from 'pino';

import config from './config';
import GraphQLService from './core/GraphQLService';
import StravaController from './strava/StravaController';
import StravaService from './strava/StravaService';

const createRouter = async (logger: pino.Logger) => {
  const router = new KoaRouter();
  const graphQLService = new GraphQLService(logger);
  const boss = new PgBoss(config.DATABASE_URL);

  try {
    await boss.start();
    await graphQLService.init();
  } catch (ex) {
    throw new Error(`Failed to init GraphQLService: ${ex.message}`);
  }

  // -- strava --
  const stravaService = new StravaService(graphQLService, boss);
  const stravaController = new StravaController(stravaService);
  const stravaRouter = new KoaRouter({ prefix: '/strava' })
    .get('/subscribe', stravaController.subscribe)
    .get('/callback', stravaController.verifyWebhook)
    .post('/callback', stravaController.webhook);
  router.use(stravaRouter.routes());

  return router;
};

export default createRouter;
