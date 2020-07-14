import { App } from '~~/types';

export type LibraryTracksState = {
  trackList: App.PlaylistTrackDetail[]
  total: number
  numberOfUnupdatedTracks: number
  actualIsSavedMap: Map<string, boolean>
};

const state: () => LibraryTracksState = () => ({
  trackList: [],
  total: 0,
  numberOfUnupdatedTracks: 0,
  actualIsSavedMap: new Map(),
});

export default state;
