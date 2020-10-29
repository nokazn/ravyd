<template>
  <div :class="$style.ReleaseDetailWrapper">
    <template v-if="$screen.isSingleColumn">
      <div>
        <ReleaseDate
          :size="size"
          :release-date="release.releaseDate"
          :release-date-precision="release.releaseDatePrecision"
        />
        <span ckass="g-small-text">･</span>
        <ReleaseTotalTracks
          :size="size"
          :total="release.totalTracks"
        />
      </div>
      <div>
        <ReleaseTotalTracks
          :size="size"
          :total="release.totalTracks"
        />
        <span ckass="g-small-text">･</span>
        <ReleaseDuration
          :size="size"
          :duration-ms="release.durationMs"
          :has-more="release.hasNextTrack || release.hasPreviousTrack"
        />
      </div>
    </template>

    <template v-else-if="$screen.isMultiColumn">
      <ReleaseDate
        icon
        :size="size"
        :release-date="release.releaseDate"
        :release-date-precision="release.releaseDatePrecision"
      />
      <ReleaseTotalTracks
        icon
        :size="size"
        :total="release.totalTracks"
      />
      <ReleaseDuration
        icon
        :size="size"
        :duration-ms="release.durationMs"
        :has-more="release.hasNextTrack || release.hasPreviousTrack"
      />
      <ReleaseLabel
        icon
        :size="size"
        :label="release.label"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import ReleaseLabel from '~/components/parts/text/ReleaseLabel.vue';
import type { App } from '~~/types';

export default defineComponent({
  components: {
    ReleaseDate,
    ReleaseTotalTracks,
    ReleaseDuration,
    ReleaseLabel,
  },

  props: {
    release: {
      type: Object as PropType<App.ReleasePage>,
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
  @include smaller-than-md() {
    display: flex;
    flex-direction: column;
  }

  @include larger-than-md() {
    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
