import { SpotifyAPI, App } from '~~/types';

export const convertTrackForCard = (
  track: SpotifyAPI.Track,
): App.ReleaseCardInfo<'track'> => {
  const info = {
    type: track.type,
    releaseType: track.album.album_type,
    releaseId: track.album.id,
    id: track.id,
    name: track.name,
    uri: track.uri,
    artists: track.artists.map((artist) => ({
      name: artist.name,
      id: artist.id,
    })),
    hash: `${track.disc_number}-${track.track_number}`,
    artworkList: track.album.images,
    externalUrls: track.external_urls,
  };

  return info;
};
