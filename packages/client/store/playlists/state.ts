import type { SpotifyAPI } from 'shared/types';

export type State = {
  playlists: SpotifyAPI.SimplePlaylist[] | undefined
  actualIsSavedMap: Map<string, boolean>
  unupdatedTrackCountsMap: Map<string, number>
  actuallyDeletedTrackMap: Map<string, {
    uri: string
    positions: [number]
  }>
}

const state = (): State => ({
  playlists: undefined,
  actualIsSavedMap: new Map(),
  unupdatedTrackCountsMap: new Map(),
  actuallyDeletedTrackMap: new Map(),
});

export default state;
