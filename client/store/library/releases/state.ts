import { App } from '~~/types';

export type LibraryReleasesState = {
  releaseList: App.ReleaseCardInfo[] | null
  isFullReleaseList: boolean
  numberOfUnupdatedReleases: number
  actualIsSavedMap: Map<string, boolean>
};

const state: () => LibraryReleasesState = () => ({
  releaseList: [],
  isFullReleaseList: false,
  numberOfUnupdatedReleases: 0,
  actualIsSavedMap: new Map(),
});

export default state;
