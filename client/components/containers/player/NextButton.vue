<template>
  <CircleButton
    title="次の曲"
    :size="size"
    :disabled="disabled"
    @click="onClicked"
  >
    mdi-skip-next
  </CircleButton>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import CircleButton from '~/components/parts/button/CircleButton.vue';

export default defineComponent({
  components: {
    CircleButton,
  },

  props: {
    size: {
      type: Number,
      default: 36,
    },
  },

  setup(_, { root }) {
    const disabled = computed(() => root.$getters()['playback/isDisallowed']('skipping_next'));
    const onClicked = () => { root.$dispatch('playback/next'); };

    return {
      disabled,
      onClicked,
    };
  },
});
</script>
