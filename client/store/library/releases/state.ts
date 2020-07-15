import { App } from '~~/types';

export type LibraryReleasesState = {
  releaseList: App.ReleaseCardInfo[]
  total: number | undefined
  numberOfUnupdatedReleases: number
  actualIsSavedMap: Map<string, boolean>
};

const state: () => LibraryReleasesState = () => ({
  releaseList: [],
  total: undefined,
  numberOfUnupdatedReleases: 0,
  actualIsSavedMap: new Map(),
});

export default state;
