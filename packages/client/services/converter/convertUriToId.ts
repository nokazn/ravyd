/**
 * @param uri spotify:track:hoge1234 のような形式
 */
export const convertUriToId = (uri: string) => {
  const elementList = uri.split(':');
  return elementList[2];
};
