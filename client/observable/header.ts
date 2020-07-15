import Vue from 'vue';

const PORTAL_NAME = 'CONTENT_HEADER';

type HeaderState = {
  isOn: boolean
  isExtended: boolean
  isIntersecting: boolean
}

export type Header = {
  readonly isExtended: boolean
  readonly isOn: boolean
  readonly extensionHeight: number
  readonly PORTAL_NAME: typeof PORTAL_NAME
  change: (isShown: boolean) => void
  on: () => void
  reset: () => void
}

const state = Vue.observable<HeaderState>({
  isOn: false,
  isExtended: false,
  // spacer の isIntersecting
  isIntersecting: true,
});

export const $header: Header = {
  get isExtended(): boolean {
    return state.isExtended;
  },
  get isOn(): boolean {
    return state.isOn;
  },
  get extensionHeight(): number {
    return state.isExtended && state.isOn
      ? 44
      : 0;
  },
  get PORTAL_NAME(): typeof PORTAL_NAME {
    return PORTAL_NAME;
  },

  change(isShown: boolean) {
    state.isExtended = isShown;
    state.isIntersecting = !isShown;
  },
  on() {
    state.isOn = true;
    // @todo 戻る/進むボタンでちらつかないように遅らせる
    setTimeout(() => {
      if (!state.isIntersecting) {
        state.isExtended = true;
      }
    }, 1000);
  },
  reset() {
    state.isExtended = false;
    state.isOn = false;
  },
};
