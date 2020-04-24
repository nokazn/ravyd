import { Getters, Mutations, Actions } from 'vuex';

export type RootState = {
  [key: string]: any
};

export type RootGetters = {}

export type RootMutations = {}

export type RootActions = {}

export const state: RootState = () => ({});
export const getters: Getters<RootState, RootGetters> = {};
export const mutations: Mutations<RootState, RootMutations> = {};
export const actions: Actions<RootState, RootActions, RootMutations> = {};
