import { computed, SetupContext } from '@vue/composition-api';

export const useButtonSize = (root: SetupContext['root']) => {
  return computed(() => (root.$screen.isMultiColumn
    ? 36
    : 32));
};
