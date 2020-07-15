import { App } from '~~/types';

export type LibraryTracksState = {
  trackList: App.PlaylistTrackDetail[]
  total: number | undefined
  numberOfUnupdatedTracks: number
  actualIsSavedMap: Map<string, boolean>
};

const state: () => LibraryTracksState = () => ({
  trackList: [],
  total: undefined,
  numberOfUnupdatedTracks: 0,
  actualIsSavedMap: new Map(),
});

export default state;
