import Vue from 'vue';

const PORTAL_NAME = 'CONTENT_HEADER';

type HeaderState = {
  isOn: boolean
  isExtended: boolean
  isIntersecting: boolean
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
  isOn: false,
  isExtended: false,
  // spacer の isIntersecting
  isIntersecting: true,
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
    state.isIntersecting = !isShown;
  },
  on() {
    state.isOn = true;
    // @todo 戻る/進むボタンでちらつかないように遅らせる
    setTimeout(() => {
      if (!state.isIntersecting) {
        state.isExtended = true;
      }
    }, 500);
  },
  reset() {
    state.isExtended = false;
    state.isOn = false;
  },
};
