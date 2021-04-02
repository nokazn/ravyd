import Vue from 'vue';
import { HEADER_HEIGHT } from '~/constants';

const PORTAL_NAME = 'CONTENT_HEADER';

type HeaderState = {
  fab: boolean;
  intersectionObserver: IntersectionObserver | undefined;
  backdropFiltered: boolean;
};

export type $Header = {
  readonly fab: boolean;
  readonly PORTAL_NAME: typeof PORTAL_NAME;
  readonly backdropFiltered: boolean;
  observe: (element: Element | null, margin?: number) => void;
  disconnectObserver: () => void;
  hideFab: () => void;
  toggleBackdropFilter: (isEnabled: boolean) => void;
};

const state = Vue.observable<HeaderState>({
  fab: false,
  intersectionObserver: undefined,
  backdropFiltered: true,
});

export const $header: $Header = {
  get fab() {
    return state.fab;
  },
  get PORTAL_NAME(): typeof PORTAL_NAME {
    return PORTAL_NAME;
  },
  get backdropFiltered() {
    return state.backdropFiltered;
  },

  /**
   * margin は正の値で受け取る
   */
  observe(element, margin) {
    if (element == null) return;
    if (state.intersectionObserver != null) {
      state.intersectionObserver.disconnect();
    }
    // ヘッダーの分のマージン
    const rootMargin = `-${margin ?? HEADER_HEIGHT}px 0px`;
    state.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // element がヘッダーに隠れて見えなくなったら fab を表示
        state.fab = !entry.isIntersecting;
      });
    }, { rootMargin });
    state.intersectionObserver.observe(element);
  },

  disconnectObserver() {
    if (state.intersectionObserver != null) {
      state.intersectionObserver.disconnect();
      state.intersectionObserver = undefined;
    }
    state.fab = false;
  },

  hideFab() {
    state.fab = false;
  },

  toggleBackdropFilter(isEnabled: boolean) {
    state.backdropFiltered = isEnabled;
  },
};
