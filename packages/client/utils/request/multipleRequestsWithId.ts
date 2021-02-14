import type { OneToHundred } from 'shared/types';

export const multipleRequestsWithId = <T>(
  request: (ids: string, length: number) => Promise<T>,
  idList: string[],
  limit: OneToHundred,
  callback?: (responseDataList: T[]) => T,
): Promise<T> => {
  const { length } = idList;
  const handler = (index: number): Promise<T> => {
    // limit ごとに分割
    const partialIdList = idList.slice(limit * index, limit * (index + 1));
    const ids = partialIdList.join(',');
    return request(ids, partialIdList.length);
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
