<template>
  <div :class="$style.ReleaseDetailWrapper">
    <template v-if="$screen.isSingleColumn">
      <ReleaseDate
        :size="size"
        :release-date="episode.releaseDate"
        :release-date-precision="episode.releaseDatePrecision"
      />
      <span ckass="g-small-text">･</span>
      <ReleaseDuration
        :size="size"
        :duration-ms="episode.durationMs"
      />
    </template>

    <template v-else-if="$screen.isMultiColumn">
      <ReleaseDate
        icon
        :size="size"
        :release-date="episode.releaseDate"
        :release-date-precision="episode.releaseDatePrecision"
      />
      <ReleaseDuration
        icon
        :size="size"
        :duration-ms="episode.durationMs"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import type { App } from '~~/types';

export default defineComponent({
  components: {
    ReleaseDate,
    ReleaseDuration,
  },

  props: {
    episode: {
      type: Object as PropType<App.EpisodeDetail>,
      required: true,
    },
  },

  setup() {
    return { size: 13 };
  },
});
</script>

<style lang="scss" module>
.ReleaseDetailWrapper {
  @include larger-than-md() {
    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
