import { SpotifyAPI, App } from '~~/types';

export const convertArtistForCard = (
  artist: SpotifyAPI.Artist,
): App.ArtistCardInfo => {
  const info = {
    name: artist.name,
    id: artist.id,
    uri: artist.uri,
    images: artist.images,
    externalUrls: artist.external_urls,
  };

  return info;
};
