import type { SpotifyAPI } from 'shared/types';
import { user } from './user';
import { playlistTrack } from './track';
import {
  externalUrls,
  image,
  followers,
  paging,
} from './spotify';

interface SimplePlaylistParams {
  collaborative?: boolean;
  description?: string;
  public?: boolean;
  tracks?: number;
}
interface PlaylistParams extends SimplePlaylistParams {
  followers?: number;
}

export const simplePlaylist = (i: number, params?: SimplePlaylistParams): SpotifyAPI.SimplePlaylist => ({
  collaborative: params?.collaborative ?? false,
  description: params?.description ?? null,
  external_urls: externalUrls(i),
  href: `path/to/playlist${i}`,
  id: `playlist${i}`,
  images: [image(1)],
  name: `playlist${i}`,
  owner: user(i),
  public: params?.public ?? true,
  snapshot_id: `snapshot_id${i}`,
  tracks: {
    total: params?.tracks ?? 10,
    href: `path/to/playlist${i}/tracks`,
  },
  type: 'playlist',
  uri: `uri${i}`,
});

export const playlist = (i: number, params?: PlaylistParams): SpotifyAPI.Playlist => ({
  ...simplePlaylist(i),
  followers: followers(params?.followers ?? 10),
  tracks: paging(
    [...new Array(params?.tracks ?? 10)].map((_, j) => playlistTrack(j)),
  ),
});
