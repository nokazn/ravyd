import { App } from '~~/types';

export type LibraryArtistsState = {
  artistList: App.ArtistCardInfo[] | null
  isFullArtistList: boolean
  numberOfUnupdatedArtist: number
};

const state: () => LibraryArtistsState = () => ({
  artistList: [],
  isFullArtistList: false,
  numberOfUnupdatedArtist: 0,
});

export default state;
