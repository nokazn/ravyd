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
export const HEADER_BACKGROUND_COLOR_RGB = [18, 18, 18] as const;
export const FOOTER_BACKGROUND_COLOR = '#323232';
export const NAVIGATION_DRAWER_BACKGROUND_COLOR = '#161616';
export const MENU_BACKGROUND_COLOR = '#323232';

export const REPEAT_STATE_LIST: SpotifyAPI.RepeatState[] = [
  'off',
  'context',
  'track',
];

export const APP_NAME = 'spotify-player';

export const TRACK_QUEUE_ARTWORK_SIZE = 40;
