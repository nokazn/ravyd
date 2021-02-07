import type { App } from '~/entities';

export type LibraryReleasesState = {
  releaseList: App.ReleaseCard<'album'>[]
  total: number | undefined
  unupdatedCounts: number
  actualIsSavedMap: Map<string, boolean>
};

const state: () => LibraryReleasesState = () => ({
  releaseList: [],
  total: undefined,
  unupdatedCounts: 0,
  actualIsSavedMap: new Map(),
});

export default state;
