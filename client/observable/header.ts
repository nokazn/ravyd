import Vue from 'vue';

import { HEADER_HEIGHT } from '~/variables';

const PORTAL_NAME = 'CONTENT_HEADER';

type HeaderState = {
  hasAdditionalContent: boolean
  isAdditionalContentShown: boolean
  intersectionObserver: IntersectionObserver | undefined
  backdropFiltered: boolean
}

export type Header = {
  readonly isAdditionalContentShown: boolean
  readonly hasAdditionalContent: boolean
  readonly PORTAL_NAME: typeof PORTAL_NAME
  readonly backdropFiltered: boolean
  observe: (element: Element | null) => void
  disconnectObserver: () => void
  toggleBackdropFilter:(isEnabled: boolean) => void
}

const state = Vue.observable<HeaderState>({
  hasAdditionalContent: false,
  isAdditionalContentShown: false,
  intersectionObserver: undefined,
  backdropFiltered: true,
});

export const $header: Header = {
  get isAdditionalContentShown() {
    return state.isAdditionalContentShown;
  },
  get hasAdditionalContent() {
    return state.hasAdditionalContent;
  },
  get PORTAL_NAME(): typeof PORTAL_NAME {
    return PORTAL_NAME;
  },
  get backdropFiltered() {
    return state.backdropFiltered;
  },

  observe(element) {
    if (element == null) return;

    if (state.intersectionObserver != null) {
      state.intersectionObserver.disconnect();
    }

    state.hasAdditionalContent = true;

    // ヘッダーの分のマージン
    const rootMargin = `-${HEADER_HEIGHT}px 0px`;
    state.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // element がヘッダーに隠れて見えなくなったら additional contents を表示
        state.isAdditionalContentShown = !entry.isIntersecting;
      });
    }, { rootMargin });
    state.intersectionObserver.observe(element);
  },

  disconnectObserver() {
    if (state.intersectionObserver != null) {
      state.intersectionObserver.disconnect();
      state.intersectionObserver = undefined;
    }

    state.isAdditionalContentShown = false;
    state.hasAdditionalContent = false;
  },

  toggleBackdropFilter(isEnabled: boolean) {
    state.backdropFiltered = isEnabled;
  },
};
