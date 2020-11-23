import Vue from 'vue';

type OverlayOptions = {
  opacity?: number;
  fullscreen: boolean;
  zIndex?: number;
}

type OverlayState = {
  value: boolean;
  opacity: number | undefined;
  fullscreen: boolean;
  zIndex: number | undefined;
}

export type $Overlay = {
  readonly value: boolean;
  readonly opacity: number | undefined;
  readonly fullscreen: boolean;
  readonly zIndex: number | undefined;
  change: (value: boolean, options?: OverlayOptions) => void;
}

const state = Vue.observable<OverlayState>({
  value: false,
  opacity: undefined,
  fullscreen: false,
  zIndex: undefined,
});

export const $overlay: $Overlay = {
  get value(): boolean {
    return state.value;
  },

  get opacity(): number | undefined {
    return state.opacity;
  },

  get fullscreen(): boolean {
    return state.fullscreen;
  },

  get zIndex(): number | undefined {
    return state.zIndex;
  },

  async change(value: boolean, options?: OverlayOptions) {
    state.opacity = options?.opacity;
    state.fullscreen = options?.fullscreen ?? false;
    state.zIndex = options?.zIndex;
    // await Vue.nextTick();
    state.value = value;
  },
};
