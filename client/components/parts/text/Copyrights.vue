<template>
  <div :class="$style.Copyrights">
    <small
      v-for="copyright in copyrightList"
      :key="copyright.text"
      :class="$style.Copyrights__item">
      {{ copyright.text }}
    </small>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SpotifyAPI } from '~~/types';

export default Vue.extend({
  props: {
    copyrightList: {
      type: Array as PropType<SpotifyAPI.Copyright[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss" module>
.Copyrights {
  &__item {
    color: $g-subtitle-color;
    display: block;
    font-size: 0.7em;
    &:not(:last-child) {
      margin-bottom: 2px;
    }
  }
}
</style>
