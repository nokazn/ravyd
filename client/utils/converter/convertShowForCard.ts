import { SpotifyAPI, App } from '~~/types';

export const convertShowForCard = (
  show: SpotifyAPI.Show | SpotifyAPI.SimpleShow,
): App.ShowCardInfo => {
  const info = {
    id: show.id,
    name: show.name,
    uri: show.uri,
    publisher: show.publisher,
    description: show.description,
    images: show.images,
    externalUrls: show.external_urls,
  };

  return info;
};
