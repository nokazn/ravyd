import { App } from '~~/types';

export type LibraryState = {
  trackList: App.PlaylistTrackDetail[] | null
  isFullTrackList: boolean
};

const state: () => LibraryState = () => ({
  trackList: [],
  isFullTrackList: false,
});

export default state;
