import Vue from 'vue';

export type ToastType = 'primary' | 'accent' | 'secondary' | 'info' | 'warning' | 'error' | 'success' | undefined;

type Toast = {
  color?: ToastType;
  message: string;
  timeout?: number;
};

type ToastState = {
  toasts: Toast[];
};

export type $Toast = {
  toasts: Toast[];
  push: (toast: Toast) => void;
  set: (toast: Toast) => void;
  pushError: (message: string, timeout?: number) => void;
  pushPrimary: (message: string, timeout?: number) => void;
  requirePremium: (message?: string) => void;
};

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

  // 同じメッセージがなければセットする
  set(toast: Toast) {
    const includedToast = state.toasts
      .find(({ message, color }) => toast.message === message && toast.color === color);
    if (includedToast == null) {
      state.toasts.push(toast);
    }
  },

  pushError(message: string, timeout?: number) {
    state.toasts.push({
      color: 'error',
      message,
      timeout,
    });
  },

  pushPrimary(message: string, timeout?: number) {
    state.toasts.push({
      color: 'primary',
      message,
      timeout,
    });
  },

  requirePremium(message?: string) {
    this.set({
      color: 'error',
      message: message ?? 'この操作にはプレミアムアカウントが必要です。',
    });
  },
};
