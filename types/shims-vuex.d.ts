import 'vuex';
import * as Root from '@/store';
import * as Auth from '@/store/auth/types';
import * as Browse from '@/store/browse/types';
import { ActionMethodMap, Merge } from '@/types';

declare module 'vuex' {
  /**
   * モジュールを追加するごとに変更
   */
  type RootState = {
    auth: Auth.AuthState
    browse: Browse.BrowseState
  } & Root.RootState

  type RootGetters = Root.RootGetters
    & Auth.RootGetters
    & Browse.RootGetters

  type RootMutations = Root.RootMutations
    & Auth.RootMutations
    & Browse.RootMutations

  type RootActions = Root.RootActions
    & Auth.RootActions
    & Browse.RootActions

  /**
   * 公式の型定義の拡張
   */
  type Getters<S, G> = {
    [K in keyof G]: (
      state: S,
      getters: G,
      rootState: RootState,
      rootGetters: RootGetters,
    ) => G[K]
  }

  type Mutations<S, M> = {
    [K in keyof M]: (state: S, payload?: M[K]) => void
  }

  type CommitArguments<
    M extends { [k: string]: any },
    T extends keyof Merge<M, RootMutations>
  > = T extends keyof RootMutations
    ? [RootMutations[T], { root: boolean }]
    : [M[T]]

  type ExtendedCommit<M> = <
    T extends keyof Merge<M, RootMutations>
  >(
    type: T,
    ...args: CommitArguments<M, T>
  ) => void

  type SFCCommit = <T extends keyof RootMutations>(
    type: T,
    payload: RootMutations[T],
  ) => void

  type DispatchArguments<
    A extends ActionMethodMap,
    T extends keyof Merge<A, RootActions>
  > = T extends keyof RootActions
    ? [Parameters<RootActions[T]>[0], { root: boolean }]
    : Parameters<A[T]>[0] extends undefined
      ? [never?]
      : [Parameters<A[T]>[0]]

  type ExtendedDispatch<A extends ActionMethodMap> = <T extends keyof Merge<A, RootActions>>(
    type: T,
    ...args: DispatchArguments<A, T>,
  ) => T extends keyof RootActions
    ? ReturnType<RootActions[T]>
    : ReturnType<A[T]>

  type SFCDispatch = <T extends keyof RootActions>(
    type: T,
    ...payload: Parameters<RootActions[T]>[0] extends undefined
      ? [never?]
      : [Parameters<RootActions[T]>[0]],
  ) => ReturnType<RootActions[T]>

  type Context<S, G, M, A extends ActionMethodMap> = {
    state: S,
    getters: G,
    commit: ExtendedCommit<M>,
    dispatch: ExtendedDispatch<A>,
    rootState: RootState,
    rootGetters: RootGetters,
  }

  type Actions<S, A extends ActionMethodMap, G = {}, M = {}> = {
    [K in keyof A]: (
      // this は仮の引数
      this: Store<RootState>,
      context: Context<S, G, M, A>,
      payload: Parameters<A[K]>[0]
    ) => ReturnType<A[K]>
  }

  // @todo
  // @ts-ignore
  interface ExtendedStore extends Store<{}> {
    getters: RootGetters
    commit: ExtendedCommit<RootMutations>
    dispatch: ExtendedDispatch<RootActions>
  }

  // nuxtServerInit 用
  type StoreContext = {
    state: RootState,
    getters: RootGetters,
    commit: ExtendedCommit<RootMutations>,
    dispatch: ExtendedDispatch<RootActions>
    rootState: RootState,
    rootGetters: RootGetters,
  }
}
