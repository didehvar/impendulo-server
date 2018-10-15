// @ts-nocheck

import { print, GraphQLSchema } from 'graphql';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import { Fetcher } from 'graphql-tools/dist/stitching/makeRemoteExecutableSchema';
import fetch from 'node-fetch';

export default async (): Promise<GraphQLSchema> => {
  const fetcher: Fetcher = async ({
    query: queryDocument,
    variables,
    operationName,
    context,
  }) => {
    const query = print(queryDocument);
    const fetchResult = await fetch(process.env.HASURA_URL!, {
      body: JSON.stringify({ query, variables, operationName }),
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Access-Key': process.env.HASURA_KEY!,
      },
      method: 'POST',
    });
    return fetchResult.json();
  };

  const schema = makeRemoteExecutableSchema({
    fetcher,
    schema: await introspectSchema(fetcher),
  });

  return schema;
};
