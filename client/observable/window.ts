import Vue from 'vue';
import { debounce } from 'lodash';

type ResizeObserver = ((e?: UIEvent) => void)

type WindowState = {
  width: number;
  observer: ResizeObserver | undefined;
}

export type $Window = {
  readonly width: number;
  observe: () => void;
  disconnectObserver: () => void;
}

const state = Vue.observable<WindowState>({
  width: 0,
  observer: undefined,
});

export const $window: $Window = {
  get width() {
    return state.width;
  },

  observe() {
    const interval = 300;
    const observer = debounce(() => {
      state.width = window.innerWidth;
    }, interval);
    window.addEventListener('resize', observer);
    state.observer = observer;
  },

  disconnectObserver() {
    const { observer } = state;
    if (observer != null) {
      window.removeEventListener('resize', observer);
      state.observer = undefined;
    }
  },
};
