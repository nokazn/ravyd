import Vue from 'vue';
import { debounce } from 'lodash';
import {
  SM_BREAK_POINT,
  MD_BREAK_POINT,
  LG_BREAK_POINT,
  XL_BREAK_POINT,
  XXL_BREAK_POINT,
} from '~/constants';

type ResizeObserver = ((e?: UIEvent) => void)
export type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

type WindowState = {
  width: number;
  observer: ResizeObserver | undefined;
}

export type $Window = {
  readonly width: number;
  readonly type: DeviceType;
  readonly isPc: boolean;
  readonly isMobile: boolean;
  readonly cardWidth: number;
  observe: () => void;
  disconnectObserver: () => void;
}

const state = Vue.observable<WindowState>({
  width: 0,
  observer: undefined,
});

export const $window: $Window = {
  get width() {
    return state.width;
  },

  get type() {
    const { width } = state;
    if (width >= XXL_BREAK_POINT) {
      return 'xxl';
    } if (width >= XL_BREAK_POINT) {
      return 'xl';
    } if (width >= LG_BREAK_POINT) {
      return 'lg';
    } if (width >= MD_BREAK_POINT) {
      return 'md';
    } if (width >= SM_BREAK_POINT) {
      return 'sm';
    }
    return 'xs';
  },

  get isPc() {
    return state.width >= LG_BREAK_POINT;
  },

  get isMobile() {
    return state.width < LG_BREAK_POINT;
  },

  get cardWidth() {
    switch (this.type) {
      case 'xxl':
      case 'xl':
      case 'lg':
      case 'md':
        return 200;
      case 'sm':
        return 160;
      case 'xs':
        return 132;
      default:
        return 200;
    }
  },

  observe() {
    const interval = 300;
    const observer = debounce(() => {
      state.width = window.innerWidth;
    }, interval);

    if (typeof window !== 'undefined') {
      state.width = window.innerWidth;
      window.addEventListener('resize', observer);
      state.observer = observer;
    }
  },

  disconnectObserver() {
    const { observer } = state;
    if (observer != null) {
      window.removeEventListener('resize', observer);
      state.observer = undefined;
    }
  },
};
