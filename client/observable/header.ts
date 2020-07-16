import Vue from 'vue';

const PORTAL_NAME = 'CONTENT_HEADER';

type HeaderState = {
  hasAdditionalContentShown: boolean
  isAdditionalContentShown: boolean
  isIntersecting: boolean
}

export type Header = {
  readonly isAdditionalContentShown: boolean
  readonly hasAdditionalContentShown: boolean
  readonly PORTAL_NAME: typeof PORTAL_NAME
  changeAdditionalContent: (isShown: boolean) => void
  enableAdditionalContent: () => void
  reset: () => void
}

const state = Vue.observable<HeaderState>({
  hasAdditionalContentShown: false,
  isAdditionalContentShown: false,
  // spacer の isIntersecting
  isIntersecting: true,
});

export const $header: Header = {
  get isAdditionalContentShown(): boolean {
    return state.isAdditionalContentShown;
  },
  get hasAdditionalContentShown(): boolean {
    return state.hasAdditionalContentShown;
  },
  get PORTAL_NAME(): typeof PORTAL_NAME {
    return PORTAL_NAME;
  },

  changeAdditionalContent(isShown: boolean) {
    state.isAdditionalContentShown = isShown;
    state.isIntersecting = !isShown;
  },
  enableAdditionalContent() {
    state.hasAdditionalContentShown = true;
    // @todo 戻る/進むボタンでちらつかないように遅らせる
    setTimeout(() => {
      if (!state.isIntersecting) {
        state.isAdditionalContentShown = true;
      }
    }, 1000);
  },
  reset() {
    state.isAdditionalContentShown = false;
    state.hasAdditionalContentShown = false;
  },
};
