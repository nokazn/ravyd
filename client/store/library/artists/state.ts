import { App } from '~~/types';

export type LibraryArtistsState = {
  artistList: App.ArtistCardInfo[] | null
  isFullArtistList: boolean
  numberOfUnupdatedArtist: number
  actualIsSavedMap: Map<string, boolean>
};

const state: () => LibraryArtistsState = () => ({
  artistList: [],
  isFullArtistList: false,
  numberOfUnupdatedArtist: 0,
  actualIsSavedMap: new Map(),
});

export default state;
