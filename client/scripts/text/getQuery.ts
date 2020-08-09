import { Route } from 'vue-router';

export const getQuery = (query: Route['query'], key: string): string | undefined => {
  const param = query[key];
  if (typeof param === 'string') return param;

  const filteredParams = param.filter((val) => val != null) as string[];
  return filteredParams[0];
};
