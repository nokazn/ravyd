export const textColorClass = (
  active: boolean | undefined,
  inactive?: boolean | undefined,
) => {
  if (inactive) return 'inactive--text';
  return active
    ? 'active--text'
    : undefined;
};

export const subtextColorClass = (
  active: boolean | undefined,
  inactive?: boolean | undefined,
) => {
  if (inactive) return 'inactive--text';
  return active
    ? 'active--text'
    : 'subtext--text';
};

export const itemColor = (
  active: boolean | undefined,
  inactive?: boolean | undefined,
) => {
  if (inactive) return 'inactive';
  return active
    ? 'active'
    : undefined;
};
