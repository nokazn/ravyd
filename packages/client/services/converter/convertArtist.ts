import { convertUriToId } from '~/services/converter';
import type { App } from '~/entities';

export const convertMinimumArtist = (artist: Spotify.Artist): App.MinimumArtist => {
  return {
    ...artist,
    id: convertUriToId(artist.uri),
  };
};
