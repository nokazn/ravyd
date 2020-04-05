import { Getters, Mutations, Actions } from 'vuex';
import { AuthState } from './auth/state';
import { BrowseState } from './browse/state';

export type RootState = {
  [key: string]: any
};

export type EntireState = {
  auth: AuthState
  browse: BrowseState
} & RootState

export type RootGetters = {}

export type RootMutations = {}

export type RootActions = {}

export const state: RootState = () => ({});
export const getters: Getters<RootState, RootGetters> = {};
export const mutations: Mutations<RootState, RootMutations> = {};
export const actions: Actions<RootState, RootActions, RootMutations, RootGetters, EntireState> = {};
