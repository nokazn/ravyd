import Vue from 'vue';

export type OverlayState = {
  isShown: boolean
}

export type Overlay = {
  readonly isShown: boolean
  change: (isShown: boolean) => void
}

const state = Vue.observable<OverlayState>({
  isShown: false,
});

export const $overlay: Overlay = {
  get isShown(): boolean {
    return state.isShown;
  },

  change(isShown: boolean) {
    state.isShown = isShown;
  },
};
