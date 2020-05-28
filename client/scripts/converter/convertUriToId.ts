/**
 * @param uri spotify:track:hoge1234 のような形式
 */
export const convertUriToId = (uri: string) => {
  const elementList = uri.split(':');
  const { length } = elementList;

  return elementList[length - 1];
};
