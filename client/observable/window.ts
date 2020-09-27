import Vue from 'vue';
import { debounce } from 'lodash';
import {
  SM_BREAK_POINT,
  MD_BREAK_POINT,
  LG_BREAK_POINT,
  XL_BREAK_POINT,
} from '~/constants';

type ResizeObserver = ((e?: UIEvent) => void)
type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type WindowState = {
  width: number;
  observer: ResizeObserver | undefined;
}

export type $Window = {
  readonly width: number;
  readonly type: DeviceType;
  readonly isPc: boolean;
  readonly isMobile: boolean;
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
    if (width >= XL_BREAK_POINT) {
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
    return state.width >= MD_BREAK_POINT;
  },
  get isMobile() {
    return state.width < SM_BREAK_POINT;
  },

  observe() {
    const interval = 300;
    const observer = debounce(() => {
      state.width = window.innerWidth;
    }, interval);
    window.addEventListener('resize', observer);
    state.observer = observer;
  },

  disconnectObserver() {
    const { observer } = state;
    if (observer != null) {
      window.removeEventListener('resize', observer);
      state.observer = undefined;
    }
  },
};
