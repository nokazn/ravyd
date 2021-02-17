import Vue from 'vue';
import { debounce } from 'lodash';
import {
  SM_BREAK_POINT,
  MD_BREAK_POINT,
  LG_BREAK_POINT,
  XL_BREAK_POINT,
  XXL_BREAK_POINT,
  FIXED_CARD_BASE_WIDTH,
  FLEX_CARD_MIN_WIDTH,
  FLEX_CARD_MAX_WIDTH,
  ARTWORK_BASE_SIZE,
} from '~/constants';

const touchScreenDetector = (): boolean => {
  if (typeof window !== 'undefined') {
    return 'ontouchstart' in window && navigator.maxTouchPoints > 0;
  }
  return false;
};

const BREAK_POINTS: Readonly<Record<DeviceType, number>> = {
  xs: 0,
  sm: SM_BREAK_POINT,
  md: MD_BREAK_POINT,
  lg: LG_BREAK_POINT,
  xl: XL_BREAK_POINT,
  xxl: XXL_BREAK_POINT,
};

const cardAdjustor = (type: DeviceType, width: number) => {
  let ratio = 1;
  switch (type) {
    case 'xxl':
    case 'xl':
    case 'lg':
    case 'md':
      break;
    case 'sm':
      ratio = 0.8;
      break;
    case 'xs':
      ratio = 0.67;
      break;
    default:
      break;
  }
  return Math.floor(width * ratio);
};

const linearCardAdjustor = (type: DeviceType, width: number) => {
  switch (type) {
    case 'xxl':
    case 'xl':
    case 'lg':
    case 'md':
      return width;
    case 'sm':
      return width - 20;
    case 'xs':
      return width - 40;
    default:
      return width;
  }
};

export type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type ResizeObserver = ((e?: UIEvent) => void)

type ScreenState = {
  width: number;
  isTouchScreen: boolean;
  observer: ResizeObserver | undefined;
}

export type $Screen = {
  readonly width: number;
  readonly isTouchScreen: boolean;
  readonly type: DeviceType;
  readonly isMobile: boolean;
  readonly isPc: boolean;
  readonly isSingleColumn: boolean;
  readonly isMultiColumn: boolean;
  readonly isSp: boolean;
  readonly smallerThan: (type: DeviceType) => boolean;
  readonly largerThan: (type: DeviceType) => boolean;
  readonly cardWidth: number;
  readonly cardWidthMinMax: Readonly<[number, number]>;
  readonly artworkSize: number;
  observe: () => void;
  disconnectObserver: () => void;
}

const state = Vue.observable<ScreenState>({
  width: 0,
  isTouchScreen: false,
  observer: undefined,
});

export const $screen: $Screen = {
  get width() {
    return state.width;
  },

  get isTouchScreen() {
    return state.isTouchScreen;
  },

  get type() {
    const { width } = state;
    if (width > XXL_BREAK_POINT) {
      return 'xxl';
    } if (width > XL_BREAK_POINT) {
      return 'xl';
    } if (width > LG_BREAK_POINT) {
      return 'lg';
    } if (width > MD_BREAK_POINT) {
      return 'md';
    } if (width > SM_BREAK_POINT) {
      return 'sm';
    }
    return 'xs';
  },

  // type のブレイクポイントをを含まない
  get smallerThan() {
    return (type: DeviceType) => state.width <= BREAK_POINTS[type];
  },

  // type のブレイクポイントをを含む
  get largerThan() {
    return (type: DeviceType) => state.width > BREAK_POINTS[type];
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

  get isSp() {
    return this.smallerThan('sm');
  },

  get cardWidth() {
    return cardAdjustor(this.type, FIXED_CARD_BASE_WIDTH);
  },

  get cardWidthMinMax() {
    const minMax: readonly [number, number] = [
      linearCardAdjustor(this.type, FLEX_CARD_MIN_WIDTH),
      linearCardAdjustor(this.type, FLEX_CARD_MAX_WIDTH),
    ];
    return minMax;
  },

  get artworkSize() {
    return linearCardAdjustor(this.type, ARTWORK_BASE_SIZE);
  },

  observe() {
    this.disconnectObserver();
    const observe = () => {
      state.width = window.innerWidth;
      state.isTouchScreen = touchScreenDetector();
    };

    if (typeof window !== 'undefined') {
      observe();
      const interval = 300;
      const observer = debounce(observe, interval);
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
