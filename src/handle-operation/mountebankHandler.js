import resolveImposterResult from './resolveImposterResult';

export default async (resolve, root, args, context, info) => {
  const result = await resolveImposterResult(root, args, context, info);
  const resultToResult = result === undefined
    ? await resolve(root, args, context, info)
    : result;
  return resultToResult;
};
