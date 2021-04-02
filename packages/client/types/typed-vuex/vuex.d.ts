import { Store, SubscribeOptions } from 'vuex';
import { Context } from '@nuxt/types';

type ActionMethods = {
  [k: string]: (...args: any) => Promise<any> | any;
};
type Dictionary<T = unknown> = Record<string, T>;
// undefined をとりうるか (省略可能か) で場合分け
type OptionalArguments<T> = Extract<T, undefined> extends never
  ? [T]
  : [T?];

/**
 * 公式の型定義の拡張
 */
declare module 'typed-vuex' {
  /**
   * getters
   */
  type VuexGetters<S, G> = {
    [K in keyof G]: (
      state: S,
      getters: G,
      rootState: RootState,
      rootGetters: RootGetters,
    ) => G[K];
  };

  /**
   * mutations
   */
  type VuexMutations<S, M> = {
    [K in keyof M]: (state: S, ...payload: OptionalArguments<M[K]>) => void;
  };

  type ExtendedCommit<M extends Dictionary> = <T extends keyof (M & RootMutations)>(
    type: T,
    ...payload: T extends keyof RootMutations
      ? [RootMutations[T], { root: boolean }]
      : OptionalArguments<M[T]>,
  ) => void;

  // SFC では全てルートから指定
  type SFCCommit = <T extends keyof RootMutations>(
    type: T,
    ...payload: OptionalArguments<RootMutations[T]>,
  ) => void;


  /**
   * actions
   */
  // ローカルモジュール内ではモジュール名なしで指定できる
  type ExtendedDispatch<A extends ActionMethods> = <T extends keyof (A & RootActions)>(
    type: T,
    ...args: T extends keyof RootActions
      ? [Parameters<RootActions[T]>[0], { root: boolean }]
      : OptionalArguments<Parameters<A[T]>[0]>,
  ) => ReturnType<(A & RootActions)[T]>;

  type SFCDispatch = <T extends keyof RootActions>(
    type: T,
    ...payload: OptionalArguments<Parameters<RootActions[T]>[0]>,
  ) => ReturnType<RootActions[T]>;

  interface _Context<S, G, M extends Dictionary, A extends ActionMethods> {
    state: S;
    getters: G;
    commit: ExtendedCommit<M>;
    dispatch: ExtendedDispatch<A>;
    rootState: RootState;
    rootGetters: RootGetters;
  }

  // nuxtServerInit 用
  interface _StoreContext {
    state: RootState;
    getters: RootGetters;
    commit: ExtendedCommit<RootMutations>;
    dispatch: ExtendedDispatch<RootActions>;
    rootState: RootState;
    rootGetters: RootGetters;
  }

  type VuexActions<S, A extends ActionMethods, G = {}, M extends Dictionary = {}> = {
    [K in keyof A]: (
      // this は仮の引数
      this: Store<RootState>,
      context: _Context<S, G, M, A>,
      ...payload: Parameters<A[K]>
    ) => ReturnType<A[K]>
  } & {
    nuxtServerInit?: (
      context: _StoreContext,
      payload: Context,
    ) => void | Promise<void>;
  };

  /**
   * subscribe
   */
  // subscribe したときのコールバックの引数
  interface ExtendedMutationPayload<T extends keyof RootMutations> {
    type: T;
    payload: RootMutations[T];
  }

  type ExtendedSubscribe = <T extends keyof RootMutations>(
    fn: (mutation: ExtendedMutationPayload<T>, state: RootState) => void | Promise<void>,
    options?: SubscribeOptions,
  ) => () => void;
}
