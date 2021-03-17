import { wrapSchema } from '@graphql-tools/wrap';
import { delegateToSchema } from '@graphql-tools/delegate';

import getCurrentSchema from '../schema-cache/getCurrentSchema';
import createSchemaExecutor from './createSchemaExecutor';

export default async ({
  endpoint,
  operationType,
  args,
  context,
  info,
}) => {
  const { path } = info;
  const executor = createSchemaExecutor({ endpoint });
  const delegatedSchema = await wrapSchema({
    schema: getCurrentSchema(),
    executor,
  });
  return delegateToSchema({
    schema: delegatedSchema,
    operation: operationType.toLowerCase(),
    fieldName: path.key,
    args,
    context,
    info,
  });
};
