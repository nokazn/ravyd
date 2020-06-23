import { SpotifyAPI } from '~~/types';

export type PlaylistsState = {
  playlists: SpotifyAPI.SimplePlaylist[] | undefined
  actualIsSavedMap: Map<string, boolean>
}

const state = (): PlaylistsState => ({
  playlists: undefined,
  actualIsSavedMap: new Map(),
});

export default state;
