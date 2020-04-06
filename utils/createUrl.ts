type UrlParams = {
  [key: string]: string;
}

export const createUrl = (baseUrl: string, params: UrlParams): string => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return url.href;
};
