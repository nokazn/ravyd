import Vue from 'vue';

type OverlayOptions = {
  opacity?: number
  zIndex?: number
}

type OverlayState = {
  isShown: boolean
  opacity: number | undefined
  zIndex: number | undefined
}

export type $Overlay = {
  readonly isShown: boolean
  change: (isShown: boolean, options?: OverlayOptions) => void
}

const state = Vue.observable<OverlayState>({
  isShown: false,
  opacity: undefined,
  zIndex: undefined,
});

export const $overlay: $Overlay = {
  get isShown(): boolean {
    return state.isShown;
  },

  change(isShown: boolean, options?: OverlayOptions) {
    state.isShown = isShown;

    if (options != null) {
      const { opacity, zIndex } = options;
      state.opacity = opacity;
      state.zIndex = zIndex;
    }
  },
};
