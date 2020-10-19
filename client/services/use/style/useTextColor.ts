import { computed, Ref } from '@vue/composition-api';

// @todo fail to apply update of props value
export const useTextColor = (active: Ref<boolean>) => {
  const textColor = computed(() => {
    return active.value
      ? 'active--text'
      : undefined;
  });
  const subtextColor = computed(() => (active.value
    ? 'active--text'
    : 'subtext--text'));

  return {
    textColor,
    subtextColor,
  };
};
