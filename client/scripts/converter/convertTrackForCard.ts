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
    hash: `${track.disc_number}-${track.track_number}`,
    images: track.album.images,
    externalUrls: track.external_urls,
  };

  return info;
};
