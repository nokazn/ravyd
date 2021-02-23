import type { SpotifyAPI } from 'shared/types';
import type { App } from '~/entities';

// destructuring assignment は使わない (process.env のプロパティに生えてるわけではない)
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN as string;
export const SERVER_ORIGIN = process.env.SERVER_ORIGIN as string;
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export const UNEXPECTED_ERROR_CODE = 'UNEXPECTED_ERROR';

/**
 * colors
 */
const rgb: [number, number, number] = [120, 122, 122];
export const DEFAULT_DOMINANT_COLOR: App.DominantColor = {
  hex: '#787a7a',
  rgb,
} as const;
// 背景とヘッダーの明度を下げる割合
export const DARKEN_FILTER_RATIO = 0.6;
export const BACKGROUND_COLOR = '#1e2022';
// #1e2022 を10進数の配列にしたもの
export const BACKGROUND_COLOR_RGB = [30, 32, 34] as const;
export const NAVIGATION_DRAWER_BACKGROUND_COLOR = '#242626';
export const CARD_BACKGROUND_COLOR = '#2a2a2c';
export const MENU_BACKGROUND_COLOR = '#2e3032';
export const FOOTER_BACKGROUND_COLOR = '#343636';

/**
 * size
 */
export const SM_BREAK_POINT = 480;
export const MD_BREAK_POINT = 768;
export const LG_BREAK_POINT = 992;
export const XL_BREAK_POINT = 1200;
export const XXL_BREAK_POINT = 1900;

export const HEADER_HEIGHT = 52;
export const FOOTER_HEIGHT = 80;
export const FOOTER_HEIGHT_MOBILE = FOOTER_HEIGHT * 0.8;
export const DEVICE_BAR_HEIGHT = 24;
export const NAVIGATION_BAR_HEIGHT = 48;
export const NAVIGATION_DRAWER_WIDTH = 200;

export const FLEX_CARD_MIN_WIDTH = 172;
export const FLEX_CARD_MAX_WIDTH = 240;
export const FIXED_CARD_BASE_WIDTH = 200;
export const ARTWORK_BASE_SIZE = 220;

export const TRACK_LIST_ARTWORK_SIZE = 40;
export const PLAYLIST_TRACK_TABLE_ARTWORK_SIZE = 48;

export const DEFAULT_BUTTON_SIZE = 36;
export const DEFAULT_BUTTON_SIZE_MOBILE = 32;

/**
 * z-index
 */
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

/**
 * player
 */
export const REPEAT_STATE_LIST: SpotifyAPI.RepeatState[] = [
  'off',
  'context',
  'track',
];
export const DEFAULT_DURATION_MS = Infinity;
export const APP_NAME = 'Ravyd';

export const EMPTY_PAGING: SpotifyAPI.Paging<unknown> = {
  href: '',
  items: [],
  limit: 0,
  next: null,
  offset: 0,
  previous: null,
  total: 0,
};
