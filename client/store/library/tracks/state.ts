import { App } from '~~/types';

export type LibraryTracksState = {
  trackList: App.PlaylistTrackDetail[] | null
  isFullTrackList: boolean
  numberOfUnupdatedTracks: number
  actualIsSavedMap: Map<string, boolean>
};

const state: () => LibraryTracksState = () => ({
  trackList: [],
  isFullTrackList: false,
  numberOfUnupdatedTracks: 0,
  actualIsSavedMap: new Map(),
});

export default state;
