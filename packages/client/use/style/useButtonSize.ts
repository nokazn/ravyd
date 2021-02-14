import { computed, SetupContext } from '@vue/composition-api';

export const useButtonSize = (root: SetupContext['root']) => {
  return computed(() => (root.$screen.isSingleColumn
    ? root.$constant.DEFAULT_BUTTON_SIZE_MOBILE
    : root.$constant.DEFAULT_BUTTON_SIZE));
};
