import { Route } from 'vue-router';

export const getQuery = (query: Route['query'], key: string): string | undefined => {
  const param = query[key];
  if (param == null || typeof param === 'string') {
    return param;
  }
  const filteredParams = param.filter((val): val is string => val != null);
  return filteredParams[0];
};
