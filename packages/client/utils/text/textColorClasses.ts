import type { App } from '~/entities';

export const textColorClass = (
  active: boolean | undefined,
  inactive?: boolean | undefined,
): App.TitleColorClass => {
  if (inactive) return 'inactive--text';
  return active
    ? 'active--text'
    : undefined;
};

export const subtextColorClass = (
  active: boolean | undefined,
  inactive?: boolean | undefined,
): App.SubtitleColorClass => {
  if (inactive) return 'inactive--text';
  return active
    ? 'active--text'
    : 'subtext--text';
};

export const itemColor = (
  active: boolean | undefined,
  inactive?: boolean | undefined,
): App.ItemColor => {
  if (inactive) return 'inactive';
  return active
    ? 'active'
    : undefined;
};
