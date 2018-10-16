import * as KoaRouter from 'koa-router';

import GraphQLService from './core/GraphQLService';
import StravaController from './strava/StravaController';
import StravaService from './strava/StravaService';

const createRouter = async () => {
  const router = new KoaRouter();
  const graphQLService = new GraphQLService();
  await graphQLService.init();

  // -- strava --
  const stravaService = new StravaService(graphQLService);
  const stravaController = new StravaController(stravaService);
  const stravaRouter = new KoaRouter({ prefix: '/strava' }).get(
    '/subscribe',
    stravaController.subscribe,
  );
  router.use(stravaRouter.routes());

  return router;
};

export default createRouter;
