// import { Spotify } from '@/types';

export type BrowseState = {
  // @todo
  newReleases: any
}

export type RootState = {
  'browse/newReleases': BrowseState['newReleases']
}

const state: (() => BrowseState) = () => ({
  newReleases: null,
});

export default state;
