import { print, GraphQLSchema } from 'graphql';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import { Fetcher } from 'graphql-tools/dist/stitching/makeRemoteExecutableSchema';
import fetch from 'node-fetch';
import { Logger } from 'pino';

import config from 'src/config';

export default async (log: Logger): Promise<GraphQLSchema> => {
  const fetcher: Fetcher = async ({
    query: queryDocument,
    variables,
    operationName,
    context,
  }) => {
    const query = print(queryDocument);
    const fetchResult = await fetch(config.HASURA_URL, {
      body: JSON.stringify({ query, variables, operationName }),
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Access-Key': config.HASURA_KEY,
      },
      method: 'POST',
    });
    const result = await fetchResult.json();

    if (result.errors) {
      log.error(result.errors, 'GraphQL error');
    }

    return result;
  };

  return await makeRemoteExecutableSchema({
    fetcher,
    schema: await introspectSchema(fetcher),
  });
};
