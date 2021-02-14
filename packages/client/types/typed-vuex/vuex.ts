import { Store, SubscribeOptions } from 'vuex';
import { Context } from '@nuxt/types';
import type { ActionMethodMap } from 'shared/types';

/**
 * 公式の型定義の拡張
 */
declare module 'typed-vuex' {
  /**
   * getters
   */
  type Getters<S, G> = {
    [K in keyof G]: (
      state: S,
      getters: G,
      rootState: RootState,
      rootGetters: RootGetters,
    ) => G[K]
  }

  /**
   * mutations
   */
  type Mutations<S, M> = {
    [K in keyof M]: Extract<M[K], undefined> extends never
      ? (state: S, payload: M[K]) => void
      : (state: S, payload?: M[K]) => void
  }

  // ローカルモジュール内ではモジュール名なしで指定できる
  type _ExtendedCommitArguments<
    M extends { [k: string]: any },
    T extends keyof (M & RootMutations)
  > = T extends keyof RootMutations
    ? [RootMutations[T], { root: boolean }]
    // undifined をとりうるか (省略可能か) で場合分け
    : Extract<M[T], undefined> extends never
      ? [M[T]]
      : [M[T]?]

  type ExtendedCommit<M> = <
    T extends keyof (M & RootMutations)
  >(
    type: T,
    ...payload: _ExtendedCommitArguments<M, T>
  ) => void

  // SFC では全てルートから指定
  type _SFCCommitArguments<
    T extends keyof RootMutations
  // undifined をとりうるか (省略可能か) で場合分け
  > = Extract<RootMutations[T], undefined> extends never
    ? [RootMutations[T]]
    : [RootMutations[T]?]

  type SFCCommit = <T extends keyof RootMutations>(
    type: T,
    ...payload: _SFCCommitArguments<T>,
  ) => void

  /**
   * actions
   */
  type _ExtendedDispatchArguments<
    A extends ActionMethodMap,
    T extends keyof (A & RootActions)
  > = T extends keyof RootActions
    ? [Parameters<RootActions[T]>[0], { root: boolean }]
    // undifined をとりうるか (省略可能か) で場合分け
    : Extract<Parameters<A[T]>[0], undefined> extends never
      ? [Parameters<A[T]>[0]]
      : [Parameters<A[T]>[0]?]

  // ローカルモジュール内ではモジュール名なしで指定できる
  type ExtendedDispatch<A extends ActionMethodMap> = <T extends keyof (A & RootActions)>(
    type: T,
    ...args: _ExtendedDispatchArguments<A, T>,
  ) => T extends keyof RootActions
    ? ReturnType<RootActions[T]>
    : ReturnType<A[T]>

  type SFCDispatch = <T extends keyof RootActions>(
    type: T,
    // undifined をとりうるか (省略可能か) で場合分け
    ...payload: Extract<Parameters<RootActions[T]>[0], undefined> extends never
      ? [Parameters<RootActions[T]>[0]]
      : [Parameters<RootActions[T]>[0]?]
  ) => ReturnType<RootActions[T]>

  type _Context<S, G, M, A extends ActionMethodMap> = {
    state: S,
    getters: G,
    commit: ExtendedCommit<M>,
    dispatch: ExtendedDispatch<A>,
    rootState: RootState,
    rootGetters: RootGetters,
  }

  // nuxtServerInit 用
  type _StoreContext = {
    state: RootState,
    getters: RootGetters,
    commit: ExtendedCommit<RootMutations>,
    dispatch: ExtendedDispatch<RootActions>
    rootState: RootState,
    rootGetters: RootGetters,
  }

  type Actions<S, A extends ActionMethodMap, G = {}, M = {}> = {
    [K in keyof A]: (
      // this は仮の引数
      this: Store<RootState>,
      context: _Context<S, G, M, A>,
      payload: Parameters<A[K]>[0]
    ) => ReturnType<A[K]>
  } & {
    nuxtServerInit?: (
      context: _StoreContext,
      payload: Context,
    ) => void | Promise<void>
  }

  /**
   * subscribe
   */
  // subscribe したときのコールバックの引数
  type ExtendedMutationPayload<T extends keyof RootMutations> = {
    type: T
    payload: RootMutations[T]
  }

  type ExtendedSubscribe = <T extends keyof RootMutations>(
    fn: (mutation: ExtendedMutationPayload<T>, state: RootState) => void | Promise<void>,
    options?: SubscribeOptions
  ) => () => void
}
