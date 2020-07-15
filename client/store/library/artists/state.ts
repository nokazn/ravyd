import { App } from '~~/types';

export type LibraryArtistsState = {
  artistList: App.ArtistCardInfo[]
  total: number | undefined
  numberOfUnupdatedArtist: number
  actualIsSavedMap: Map<string, boolean>
};

const state: () => LibraryArtistsState = () => ({
  artistList: [],
  total: undefined,
  numberOfUnupdatedArtist: 0,
  actualIsSavedMap: new Map(),
});

export default state;
