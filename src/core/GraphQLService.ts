import {
  graphql,
  ExecutionResult,
  GraphQLArgs,
  GraphQLSchema,
  Source,
} from 'graphql';
import { ExecutionResultDataDefault } from 'graphql/execution/execute';
import * as pino from 'pino';

import makeSchema from './schema';

interface QueryArgs extends GraphQLArgs {
  schema: never;
}

class GraphQLService {
  private schema: GraphQLSchema;
  private logger: pino.Logger;
  private initialised = false;

  constructor(logger: pino.Logger) {
    this.logger = logger;
  }

  async init() {
    this.initialised = true;
    this.schema = await makeSchema();
  }

  async query<TData = ExecutionResultDataDefault>(
    source: QueryArgs['source'],
    variableValues?: QueryArgs['variableValues'],
  ): Promise<ExecutionResult<TData>>;
  async query<TData = ExecutionResultDataDefault>(
    args: QueryArgs | Source | string,
    variableValues?: QueryArgs['variableValues'],
  ): Promise<ExecutionResult<TData>> {
    if (!this.initialised) {
      throw new Error('GraphQLService not initialised');
    }

    let result: ExecutionResult<TData>;

    if (typeof args === 'string' || args instanceof Source) {
      if (variableValues) {
        this.logger.info(variableValues);
        result = await graphql<TData>(
          this.schema,
          args,
          null,
          null,
          variableValues,
        );
      } else {
        result = await graphql<TData>(this.schema, args);
      }
    } else {
      result = await graphql<TData>({
        schema: this.schema,
        ...args,
      });
    }

    if (result.errors) {
      this.logger.error(result.errors, 'GraphQLService query errors');
    }

    return result;
  }
}

export default GraphQLService;
