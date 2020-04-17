import { Spotify } from '@/types';

export type BrowseState = {
  newReleases: Spotify.NewReleases | null
}

export type RootState = {
  'browse/newReleases': BrowseState['newReleases']
}

const state: (() => BrowseState) = () => ({
  newReleases: null,
});

export default state;
