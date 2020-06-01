import { App } from '~~/types';

export type LibraryReleasesState = {
  releaseList: App.ReleaseCardInfo[] | null
  isFullReleaseList: boolean
  numberOfUnupdatedReleases: number
};

const state: () => LibraryReleasesState = () => ({
  releaseList: [],
  isFullReleaseList: false,
  numberOfUnupdatedReleases: 0,
});

export default state;
