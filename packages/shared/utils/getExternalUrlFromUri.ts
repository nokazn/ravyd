export const getExternalUrlFromUri = (uri: string): string | undefined => {
  const baseUrl = 'https://open.spotify.com';
  const elementList = uri.split(':');
  const { length } = elementList;
  const id = elementList[length - 1];
  const type = elementList[length - 2];

  switch (type) {
    case 'track':
    case 'episode':
      return `${baseUrl}/${type}/${id}`;
    default:
      return undefined;
  }
};
