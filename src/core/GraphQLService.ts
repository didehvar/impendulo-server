import {
  graphql,
  ExecutionResult,
  GraphQLArgs,
  GraphQLSchema,
  Source,
} from 'graphql';
import { ExecutionResultDataDefault } from 'graphql/execution/execute';

import makeSchema from './schema';

interface QueryArgs extends GraphQLArgs {
  schema: never;
}

class GraphQLService {
  private schema: GraphQLSchema;
  private initialised = false;

  async init() {
    this.initialised = true;
    this.schema = await makeSchema();
  }

  query<TData = ExecutionResultDataDefault>(
    source: QueryArgs['source'],
    variableValues?: QueryArgs['variableValues'],
  ): Promise<ExecutionResult<TData>>;
  query<TData = ExecutionResultDataDefault>(
    args: QueryArgs | Source | string,
    variableValues?: QueryArgs['variableValues'],
  ): Promise<ExecutionResult<TData>> {
    if (!this.initialised) {
      throw new Error('GraphQLService not initialised');
    }

    if (typeof args === 'string' || args instanceof Source) {
      if (variableValues) {
        return graphql(this.schema, args, null, null, variableValues);
      }

      return graphql(this.schema, args);
    }

    return graphql({
      schema: this.schema,
      ...args,
    });
  }
}

export default GraphQLService;
