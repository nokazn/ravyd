import {
  GetterTree,
  MutationTree,
  ActionTree,
} from 'vuex';

export type RootState = {};

export const state: RootState = () => ({});
export const getters: GetterTree<RootState, RootState> = {};
export const mutations: MutationTree<RootState> = {};
export const actions: ActionTree<RootState, RootState> = {};
