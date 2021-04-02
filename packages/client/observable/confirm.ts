import Vue from 'vue';
import { isPromise } from 'shared/utils';

type ConfirmState = {
  value: boolean;
  color: string | undefined;
  title: string | undefined;
  text: string | undefined;
  description: string;
  loading: boolean;
  onConfirm: (() => void | Promise<void>) | undefined;
};
type ConfirmOptions = {
  color?: string | undefined;
  title?: string | undefined;
  text?: string | undefined;
  description: string;
  loading?: boolean;
  onConfirm: (() => void | Promise<void>) | undefined;
};

export type $Confirm = {
  readonly color: string | undefined;
  readonly title: string | undefined;
  readonly text: string | undefined;
  readonly description: string;
  readonly loading: boolean;
  value: boolean;
  open: (params: ConfirmOptions) => void;
  close: () => void;
  load: (loading: boolean) => void;
  onConfirm: (...args: unknown[]) => Promise<void>;
};

const state = Vue.observable<ConfirmState>({
  value: false,
  color: undefined,
  title: undefined,
  text: undefined,
  description: '',
  loading: false,
  onConfirm: undefined,
});

export const $confirm: $Confirm = {
  get color() {
    return state.color;
  },
  get title() {
    return state.title;
  },
  get text() {
    return state.text;
  },
  get description() {
    return state.description;
  },
  get loading() {
    return state.loading;
  },

  get value() {
    return state.value;
  },
  set value(value: boolean) {
    state.value = value;
  },

  open(params: ConfirmOptions) {
    state.color = params.color;
    state.title = params.title;
    state.text = params.text;
    state.description = params.description;
    state.loading = params.loading ?? false;
    state.onConfirm = params.onConfirm;
    state.value = true;
  },

  close() {
    state.value = false;
  },

  load(loading: boolean) {
    state.loading = loading;
  },

  async onConfirm() {
    if (!state.value || state.onConfirm == null) {
      state.value = false;
      return;
    }

    if (isPromise(state.onConfirm)) {
      state.loading = true;
      (state.onConfirm() as Promise<void>)
        .then(() => {
          state.value = false;
        })
        .finally(() => {
          state.loading = false;
        });
    } else {
      state.onConfirm();
      state.value = false;
    }
  },
};
