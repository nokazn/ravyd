import { App } from '~~/types';

export type LibraryArtistsState = {
  artistList: App.ArtistCardInfo[]
  total: number | undefined
  unupdatedCounts: number
  actualIsSavedMap: Map<string, boolean>
};

const state: () => LibraryArtistsState = () => ({
  artistList: [],
  total: undefined,
  unupdatedCounts: 0,
  actualIsSavedMap: new Map(),
});

export default state;
