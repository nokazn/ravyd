import Vue from 'vue';

const PORTAL_NAME = 'CONTENT_HEADER';

type HeaderState = {
  isExtended: boolean
  isOn: boolean
}

export type Header = {
  readonly isExtended: boolean
  readonly extensionHeight: number
  readonly PORTAL_NAME: typeof PORTAL_NAME
  change: (isShown: boolean) => void
  on: () => void
  reset: () => void
}

const state = Vue.observable<HeaderState>({
  isExtended: false,
  isOn: false,
});

export const $header: Header = {
  get isExtended(): boolean {
    return state.isExtended && state.isOn;
  },
  get extensionHeight(): number {
    return this.isExtended
      ? 44
      : 0;
  },
  get PORTAL_NAME(): typeof PORTAL_NAME {
    return PORTAL_NAME;
  },

  change(isShown: boolean) {
    state.isExtended = isShown;
  },
  on() {
    state.isOn = true;
  },
  reset() {
    state.isExtended = false;
    state.isOn = false;
  },
};
