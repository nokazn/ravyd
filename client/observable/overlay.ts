import Vue from 'vue';

type OverlayOptions = {
  opacity?: number;
  zIndex?: number;
}

type OverlayState = {
  value: boolean;
  opacity: number | undefined;
  zIndex: number | undefined;
}

export type $Overlay = {
  readonly value: boolean;
  readonly opacity: number | undefined;
  readonly zIndex: number | undefined;
  change: (value: boolean, options?: OverlayOptions) => void;
}

const state = Vue.observable<OverlayState>({
  value: false,
  opacity: undefined,
  zIndex: undefined,
});

export const $overlay: $Overlay = {
  get value(): boolean {
    return state.value;
  },

  get opacity(): number | undefined {
    return state.opacity;
  },

  get zIndex(): number | undefined {
    return state.zIndex;
  },

  change(value: boolean, options?: OverlayOptions) {
    state.value = value;

    if (options != null) {
      const { opacity, zIndex } = options;
      state.opacity = opacity;
      state.zIndex = zIndex;
    }
  },
};
