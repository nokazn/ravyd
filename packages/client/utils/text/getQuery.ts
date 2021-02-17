import { Route } from 'vue-router';

export const getQuery = (query: Route['query'], key: string): string | undefined => {
  // TODO: param は Nullable
  const param = query[key];
  if (param == null || typeof param === 'string') return param;

  const filteredParams = param.filter((val) => val != null) as string[];
  return filteredParams[0];
};
