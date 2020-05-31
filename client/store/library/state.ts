import { App } from '~~/types';

export type LibraryState = {
  trackList: App.PlaylistTrackDetail[] | null
  isFullTrackList: boolean
  numberOfUnupdatedTracks: number
};

const state: () => LibraryState = () => ({
  trackList: [],
  isFullTrackList: false,
  numberOfUnupdatedTracks: 0,
});

export default state;
