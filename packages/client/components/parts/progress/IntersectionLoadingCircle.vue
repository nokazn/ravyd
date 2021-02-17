<template>
  <div
    ref="LOADING_REF"
    :class="$style.LoadingCircle"
  >
    <v-progress-circular
      v-if="loading"
      indeterminate
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useIntersectionObserver } from '~/use/observer';

export const APPEAR = 'appear';

export type On = {
  [APPEAR]: void;
}

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },

  setup(_, { emit }) {
    const LOADING_REF = ref<HTMLDivElement>();
    useIntersectionObserver(LOADING_REF, (entry) => {
      if (entry.isIntersecting) {
        emit(APPEAR);
      }
    }, {
      rootMargin: '400px 0px',
    });

    return {
      observer: undefined,
      LOADING_REF,
    };
  },
});
</script>

<style lang="scss" module>
.LoadingCircle {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
