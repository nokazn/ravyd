import { SpotifyAPI, App } from '~~/types';

export const convertTrackForCard = (
  track: SpotifyAPI.Track,
): App.ReleaseCardInfo<'track'> => {
  const info = {
    type: track.type,
    releaseId: track.album.id,
    id: track.id,
    name: track.name,
    uri: track.uri,
    artists: track.artists,
    images: track.album.images,
    externalUrls: track.external_urls,
    linkedFrom: track.linked_from,
  };

  return info;
};
