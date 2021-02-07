import type { App } from '~/entities';

export type LibraryTracksState = {
  trackList: App.PlaylistTrackDetail[]
  total: number | undefined
  unupdatedCounts: number
  actualIsSavedMap: Map<string, boolean>
};

const state: () => LibraryTracksState = () => ({
  trackList: [],
  total: undefined,
  unupdatedCounts: 0,
  actualIsSavedMap: new Map(),
});

export default state;
