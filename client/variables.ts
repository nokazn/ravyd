import { SpotifyAPI, App } from '~~/types';

const rgb: [number, number, number] = [60, 60, 60];
export const DEFAULT_DOMINANT_COLOR: App.DominantColorInfo = {
  hex: '#3c3c3c',
  rgb,
} as const;

// 背景とヘッダーの明度を下げる割合
export const DARKEN_FILTER_RATIO = 0.9;
export const BACKGROUND_COLOR = '#121212';
// #121212 を10進数の配列にしたもの
export const BACKGROUND_COLOR_RGB = [18, 18, 18] as const;
export const FOOTER_BACKGROUND_COLOR = '#303030';
export const NAVIGATION_DRAWER_BACKGROUND_COLOR = '#161616';
export const MENU_BACKGROUND_COLOR = '#3c3c3c';

export const HEADER_HEIGHT = 52;
export const FOOTER_HEIGHT = 80;
export const NAVIGATION_DRAWER_WIDTH = 200;
export const FLEX_CARD_MIN_WIDTH = 160;
export const FLEX_CARD_MAX_WIDTH = 240;

export const REPEAT_STATE_LIST: SpotifyAPI.RepeatState[] = [
  'off',
  'context',
  'track',
];
export const DEFAULT_DURATION_MS = Infinity;
export const APP_NAME = 'spotify-player';

export const TRACK_LIST_ARTWORK_SIZE = 40;

export const Z_INDEX_OF = {
  loading: 13,
  toast: 12,
  modal: 12,
  frontMenu: 11,
  overlay: 10,
  menu: 9,
  header: 4,
  navigationDrawer: 4,
  footer: 4,
  floatingButton: 3,
  tab: 3,
  textGradation: 2,
} as const;

export const emptyPaging: SpotifyAPI.Paging<unknown> = {
  href: '',
  items: [],
  limit: 0,
  next: null,
  offset: 0,
  previous: null,
  total: 0,
};
