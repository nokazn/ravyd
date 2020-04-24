import { SpotifyAPI } from '~~/types';

export type BrowseState = {
  newReleases: SpotifyAPI.Browse.NewReleases | null
}

export type RootState = {
  'browse/newReleases': BrowseState['newReleases']
}

const state: (() => BrowseState) = () => ({
  newReleases: null,
});

export default state;
