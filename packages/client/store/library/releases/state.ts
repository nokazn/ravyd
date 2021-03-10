import type { App } from '~/entities';

export type State = {
  releaseList: App.ReleaseCard<'album'>[];
  total: number | undefined;
  unupdatedCounts: number;
  actualIsSavedMap: Map<string, boolean>;
};

const state: () => State = () => ({
  releaseList: [],
  total: undefined,
  unupdatedCounts: 0,
  actualIsSavedMap: new Map(),
});

export default state;
