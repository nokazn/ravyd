import { App } from '~~/types';

export type LibraryTracksState = {
  trackList: App.PlaylistTrackDetail[] | null
  isFullTrackList: boolean
  numberOfUnupdatedTracks: number
};

const state: () => LibraryTracksState = () => ({
  trackList: [],
  isFullTrackList: false,
  numberOfUnupdatedTracks: 0,
});

export default state;
