import Vue from 'vue';

export type ToastType = 'primary' | 'accent' | 'secondary' | 'info' | 'warning' | 'error' | 'success' | undefined

type ToastState = {
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

const state = Vue.observable<ToastState>({
  isShown: false,
  type: undefined,
  message: '',
});

export const $toast: Toast = {
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
