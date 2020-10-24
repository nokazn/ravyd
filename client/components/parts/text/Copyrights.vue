<template>
  <div :class="$style.Copyrights">
    <small
      v-for="copyright in parsedCopyrights"
      :key="copyright"
      :class="$style.Copyrights__item"
      class="subtext--text"
    >
      {{ copyright }}
    </small>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { parseCopyrights } from '~/utils/text';
import { SpotifyAPI } from '~~/types';

export default defineComponent({
  props: {
    copyrights: {
      type: Array as PropType<SpotifyAPI.Copyright[]>,
      required: true,
    },
  },

  setup(props) {
    const parsedCopyrights = parseCopyrights(props.copyrights);
    return { parsedCopyrights };
  },
});
</script>

<style lang="scss" module>
.Copyrights {
  &__item {
    display: block;
    font-size: 0.75em;
  }
}
</style>
