export const multipleRequestsWithId = <T>(
  request: (ids: string) => Promise<T>,
  idList: string[],
  limit: number,
  callback?: (responseDataList: T[]) => T,
): Promise<T> => {
  const { length } = idList;
  const handler = (index: number): Promise<T> => {
    // limit ごとに分割
    const ids = idList.slice(limit * index, limit * (index + 1)).join(',');
    return request(ids);
  };
  const counts = Math.ceil(length / limit);

  return Promise.all([...new Array(counts)]
    .map((_, i) => handler(i)))
    .then(callback)
    .catch((err: Error) => {
      console.error({ err });
      throw err;
    });
};
