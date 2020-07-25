import { App } from '~~/types';

export type LibraryShowsState = {
  showList: App.ShowCardInfo[]
  total: number | undefined
  unupdatedCounts: number
  actualIsSavedMap: Map<string, boolean>
}

const state = (): LibraryShowsState => ({
  showList: [],
  total: undefined,
  unupdatedCounts: 0,
  actualIsSavedMap: new Map(),
});

export default state;
