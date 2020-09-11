import Vue from 'vue';

export type ToastType = 'primary' | 'accent' | 'secondary' | 'info' | 'warning' | 'error' | 'success' | undefined

type Toast = {
  color?: ToastType
  message: string
  timeout?: number
}

type ToastState = {
  toasts: Toast[]
}

export type $Toast = {
  toasts: Toast[]
  push: (toast: Toast) => void
}

const state = Vue.observable<ToastState>({
  toasts: [],
});

export const $toast: $Toast = {
  get toasts() {
    return state.toasts;
  },
  set toasts(toasts: Toast[]) {
    state.toasts = toasts;
  },

  push(toast: Toast) {
    state.toasts.push(toast);
  },
};
