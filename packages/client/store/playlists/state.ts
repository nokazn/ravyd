import type { SpotifyAPI } from 'shared/types';

export interface DeletedTrack {
  uri: string;
  positions: [number];
}

export type State = {
  playlists: SpotifyAPI.SimplePlaylist[] | undefined;
  actualIsSavedMap: Map<string, boolean>;
  unacquiredTrackMap: Map<string, number>;
  deletedTrackMap: Map<string, DeletedTrack>;
};

const state = (): State => ({
  playlists: undefined,
  actualIsSavedMap: new Map(),
  unacquiredTrackMap: new Map(),
  deletedTrackMap: new Map(),
});

export default state;
