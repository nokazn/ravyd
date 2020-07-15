import { App } from '~~/types';

export type LibraryReleasesState = {
  releaseList: App.ReleaseCardInfo[]
  total: number
  numberOfUnupdatedReleases: number
  actualIsSavedMap: Map<string, boolean>
};

const state: () => LibraryReleasesState = () => ({
  releaseList: [],
  total: 0,
  numberOfUnupdatedReleases: 0,
  actualIsSavedMap: new Map(),
});

export default state;
