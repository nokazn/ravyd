import Vue from 'vue';
import { debounce } from 'lodash';
import {
  SM_BREAK_POINT,
  MD_BREAK_POINT,
  LG_BREAK_POINT,
  XL_BREAK_POINT,
  XXL_BREAK_POINT,
  FIXED_CARD_BASE_WIDTH,
  ARTWORK_BASE_SIZE,
} from '~/constants';

const BREAK_POINTS: Readonly<Record<DeviceType, number>> = {
  xs: 0,
  sm: SM_BREAK_POINT,
  md: MD_BREAK_POINT,
  lg: LG_BREAK_POINT,
  xl: XL_BREAK_POINT,
  xxl: XXL_BREAK_POINT,
};

export type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type ResizeObserver = ((e?: UIEvent) => void)

type WindowState = {
  width: number;
  observer: ResizeObserver | undefined;
}

export type $Window = {
  readonly width: number;
  readonly type: DeviceType;
  readonly isMobile: boolean;
  readonly isPc: boolean;
  readonly isSingleColumn: boolean;
  readonly isMultiColumn: boolean;
  readonly smallerThan: (type: DeviceType) => boolean;
  readonly largerThan: (type: DeviceType) => boolean;
  readonly cardWidth: number;
  readonly artworkSize: number;
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

  // type のブレイクポイントをを含まない
  get smallerThan() {
    return (type: DeviceType) => state.width < BREAK_POINTS[type];
  },

  // type のブレイクポイントをを含む
  get largerThan() {
    return (type: DeviceType) => state.width >= BREAK_POINTS[type];
  },

  get isMobile() {
    return this.smallerThan('lg');
  },

  get isPc() {
    return this.largerThan('lg');
  },

  get isSingleColumn() {
    return this.smallerThan('md');
  },

  get isMultiColumn() {
    return this.largerThan('md');
  },

  get cardWidth() {
    switch (this.type) {
      case 'xxl':
      case 'xl':
      case 'lg':
      case 'md':
        return FIXED_CARD_BASE_WIDTH;
      case 'sm':
        return FIXED_CARD_BASE_WIDTH * 0.8;
      case 'xs':
        return FIXED_CARD_BASE_WIDTH * 0.67;
      default:
        return FIXED_CARD_BASE_WIDTH;
    }
  },

  get artworkSize() {
    switch (this.type) {
      case 'xxl':
      case 'xl':
      case 'lg':
      case 'md':
        return ARTWORK_BASE_SIZE;
      case 'sm':
        return ARTWORK_BASE_SIZE - 20;
      case 'xs':
        return ARTWORK_BASE_SIZE - 40;
      default:
        return ARTWORK_BASE_SIZE;
    }
  },

  observe() {
    this.disconnectObserver();
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
