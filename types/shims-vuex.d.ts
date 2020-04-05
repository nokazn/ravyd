import 'vuex';
import * as Root from '@/store';
import * as Auth from '@/store/auth/types';
import { MethodMap } from '@/types';

declare module 'vuex' {
  /**
   * モジュールを追加するごとに変更
   */
  type RootState = {
    auth: Auth.AuthState
  } & Root.RootState

  type RootGetters = Root.RootGetters
    & Auth.RootGetters

  type RootMutations = Root.RootMutations
    & Auth.RootMutations

  type RootActions = Root.RootActions
    & Auth.RootActions

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

  type ExtendedCommit<M> = <T extends keyof M>(
    type: T,
    payload?: M[T],
  ) => void

  type ExtendedDispatch<A extends MethodMap> = <T extends keyof A>(
    type: T,
    payload?: Parameters<A[T]>[0]
  ) => ReturnType<A[T]>

  type Context<S, G, M, A extends MethodMap> = {
    state: S,
    getters: G,
    commit: ExtendedCommit<M>,
    dispatch: ExtendedDispatch<A>,
    rootState: RootState,
    rootGetters: RootGetters,
  }

  type Actions<S, A extends MethodMap, G = {}, M = {}> = {
    [K in keyof A]: (
      // this は仮の引数
      this: Store<RootState>,
      context: Context<S, G, M, A>,
      payload: Parameters<A[K]>[0]
    ) => ReturnType<A[K]>
  }

  interface ExtendedStore extends Store<{}> {
    getters: RootGetters
    commit: ExtendedCommit<RootMutations>
    dispatch: ExtendedDispatch<RootActions>
  }
}
