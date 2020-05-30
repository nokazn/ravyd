import { App } from '~~/types';

export type LibraryState = {
  trackList: App.PlaylistTrackDetail[] | null
};

const state: () => LibraryState = () => ({
  trackList: [],
});

export default state;
