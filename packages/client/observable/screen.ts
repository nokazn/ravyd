import Vue from 'vue';
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

export type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type MediaQueryListObserver = (e: MediaQueryListEvent) => void;

type ScreenState = {
  type: DeviceType;
  isTouchScreen: boolean;
  mediaQueries: Partial<Record<DeviceType, MediaQueryList>>;
  observers: Partial<Record<DeviceType, MediaQueryListObserver>>;
};

export type $Screen = {
  readonly isTouchScreen: boolean;
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
};

const BREAK_POINTS: Readonly<Record<DeviceType, number>> = {
  xs: 0,
  sm: SM_BREAK_POINT,
  md: MD_BREAK_POINT,
  lg: LG_BREAK_POINT,
  xl: XL_BREAK_POINT,
  xxl: XXL_BREAK_POINT,
};

const mediaQueryRange = (min: number | undefined, max: number | undefined): MediaQueryList => {
  const minWidth = min && min > 0
    ? `(min-width:${min}px)`
    : '';
  const maxWidth = max && (!min || max > min)
    ? `(max-width:${max}px)`
    : '';
  return window.matchMedia([minWidth, maxWidth]
    .filter((w) => w !== '')
    .join(' and '));
};

const touchScreenDetector = (): boolean => {
  if (typeof window !== 'undefined') {
    return 'ontouchstart' in window && navigator.maxTouchPoints > 0;
  }
  return false;
};

const computeType = (width: number) => {
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

const state = Vue.observable<ScreenState>({
  type: 'xs',
  isTouchScreen: false,
  mediaQueries: {},
  observers: {},
});

export const $screen: $Screen = {
  get isTouchScreen() {
    return state.isTouchScreen;
  },

  // type のブレイクポイントをを含まない
  get smallerThan() {
    return (type: DeviceType) => BREAK_POINTS[state.type] < BREAK_POINTS[type];
  },

  // type のブレイクポイントをを含む
  get largerThan() {
    return (type: DeviceType) => BREAK_POINTS[state.type] >= BREAK_POINTS[type];
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
    return cardAdjustor(state.type, FIXED_CARD_BASE_WIDTH);
  },

  get cardWidthMinMax() {
    const minMax: readonly [number, number] = [
      linearCardAdjustor(state.type, FLEX_CARD_MIN_WIDTH),
      linearCardAdjustor(state.type, FLEX_CARD_MAX_WIDTH),
    ];
    return minMax;
  },

  get artworkSize() {
    return linearCardAdjustor(state.type, ARTWORK_BASE_SIZE);
  },

  observe() {
    if (window == null) return;
    const mediaQueries: Record<DeviceType, MediaQueryList> = {
      xs: mediaQueryRange(undefined, SM_BREAK_POINT),
      sm: mediaQueryRange(SM_BREAK_POINT + 1, MD_BREAK_POINT),
      md: mediaQueryRange(MD_BREAK_POINT + 1, LG_BREAK_POINT),
      lg: mediaQueryRange(LG_BREAK_POINT + 1, XL_BREAK_POINT),
      xl: mediaQueryRange(XL_BREAK_POINT + 1, XXL_BREAK_POINT),
      xxl: mediaQueryRange(XXL_BREAK_POINT + 1, undefined),
    };
    const observe = (type: DeviceType): MediaQueryListObserver => (e) => {
      if (e.matches) {
        state.type = type;
        state.isTouchScreen = touchScreenDetector();
      }
    };
    (Object.keys(mediaQueries) as DeviceType[]).forEach((type) => {
      const observer = observe(type);
      mediaQueries[type].addEventListener('change', observer);
      state.observers[type] = observer;
    });

    state.type = computeType(window.innerWidth);
    state.isTouchScreen = touchScreenDetector();
    state.mediaQueries = mediaQueries;
  },

  disconnectObserver() {
    (Object.entries(state.observers) as [DeviceType, MediaQueryListObserver][]).forEach(([type, observer]) => {
      const mediaQuery = state.mediaQueries[type];
      if (mediaQuery != null) {
        mediaQuery.removeEventListener('change', observer);
      }
    });
    state.observers = {};
  },
};
