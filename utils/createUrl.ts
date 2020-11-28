export const createUrl = (
  baseUrl: string,
  params: Record<string, string>,
): string => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return url.href;
};
