import Vue from 'vue';
import { Plugin } from '@nuxt/types';

export type ToastType = 'primary' | 'accent' | 'secondary' | 'info' | 'warning' | 'error' | 'success' | undefined
export type ToastState = {
  isShown: boolean
  type: ToastType
  message: string
}
export type Toast = {
  readonly isShown: boolean
  readonly type: ToastType
  readonly message: string
  init:() => void
  show:(type: ToastType, message: string) => void
  change: (isShown: boolean) => void
}

const injectToast: Plugin = (_, inject) => {
  const state = Vue.observable<ToastState>({
    isShown: false,
    type: undefined,
    message: '',
  });

  const toast: Toast = {
    get isShown(): boolean {
      return state.isShown;
    },
    get type(): ToastType {
      return state.type;
    },
    get message(): string {
      return state.message;
    },

    init() {
      state.isShown = false;
      state.type = undefined;
      state.message = '';
    },

    show(type: ToastType, message: string) {
      state.isShown = true;
      state.type = type;
      state.message = message;
    },

    change(isShown: boolean) {
      state.isShown = isShown;
    },
  };

  inject('toast', toast);
};

export default (injectToast);
