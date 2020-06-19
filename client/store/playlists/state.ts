import { SpotifyAPI } from '~~/types';

export type PlaylistsState = {
  playlists: SpotifyAPI.SimplePlaylist[] | undefined
}

const state = (): PlaylistsState => ({
  playlists: undefined,
});

export default state;
