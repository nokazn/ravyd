import 'vuex';
import { MethodMap } from '@/types';

declare module 'vuex' {
  type Getters<S, G> = {
    [K in keyof G]: (state: S, getters: G) => G[K]
  }

  type Mutations<S, M> = {
    [K in keyof M]: (state: S, payload: M[K]) => void
  }

  type ExtendedCommit<M> = <T extends keyof M>(
    type: T,
    payload: M[T],
  ) => void

  type ExtendedDispatch<A extends MethodMap> = <T extends keyof A>(
    type: T,
    payload?: Parameters<A[T]>[0]
  ) => ReturnType<A[T]>

  type Context<S, G, M, A extends MethodMap, RS, RG> = {
    state: S,
    getters: G,
    commit: ExtendedCommit<M>,
    dispatch: ExtendedDispatch<A>,
    rootState: RS,
    rootGetters: RG,
  }

  type Actions<S, A extends MethodMap, G = {}, M = {}, RS = {}, RG = {}> = {
    [K in keyof A]: (
      // this は仮の引数
      this: Store<RS>,
      context: Context<S, G, M, A, RS, RG>,
      payload: Parameters<A[K]>[0]
    ) => ReturnType<A[K]>
  }
}
