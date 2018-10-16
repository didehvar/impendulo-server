import * as KoaRouter from 'koa-router';
import * as pino from 'pino';

import GraphQLService from './core/GraphQLService';
import StravaController from './strava/StravaController';
import StravaService from './strava/StravaService';

const createRouter = async (logger: pino.Logger) => {
  const router = new KoaRouter();
  const graphQLService = new GraphQLService(logger);
  await graphQLService.init();

  // -- strava --
  const stravaService = new StravaService(graphQLService);
  const stravaController = new StravaController(stravaService);
  const stravaRouter = new KoaRouter({ prefix: '/strava' })
    .get('/subscribe', stravaController.subscribe)
    .get('/callback', stravaController.verifyWebhook);
  router.use(stravaRouter.routes());

  return router;
};

export default createRouter;
