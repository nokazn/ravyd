<template>
  <div
    v-if="$window.isSingleColumn"
    :class="$style.ReleaseDetailWrapper"
  >
    <ReleaseDate
      hide-icon
      :release-date="episode.releaseDate"
      :release-date-precision="episode.releaseDatePrecision"
    />
    <span ckass="g-small-text">･</span>
    <ReleaseDuration
      hide-icon
      is-full
      :duration-ms="episode.durationMs"
    />
  </div>
  <div
    v-else-if="$window.isMultiColumn"
    :class="$style.ReleaseDetailWrapper"
  >
    <ReleaseDate
      :release-date="episode.releaseDate"
      :release-date-precision="episode.releaseDatePrecision"
    />
    <ReleaseDuration
      is-full
      :duration-ms="episode.durationMs"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import type { App } from '~~/types';

export default Vue.extend({
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
});
</script>

<style lang="scss" module>
.ReleaseDetailWrapper {
  @include larger-than-md {
    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
