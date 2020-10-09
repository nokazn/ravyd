<template>
  <div
    v-if="$screen.isSingleColumn"
    :class="$style.ReleaseDetailWrapper"
  >
    <div>
      <ReleaseDate
        hide-icon
        :release-date="release.releaseDate"
        :release-date-precision="release.releaseDatePrecision"
      />
      <span ckass="g-small-text">･</span>
      <ReleaseTotalTracks
        hide-icon
        :total="release.totalTracks"
      />
    </div>
    <div>
      <ReleaseTotalTracks
        hide-icon
        :total="release.totalTracks"
      />
      <span ckass="g-small-text">･</span>
      <ReleaseDuration
        hide-icon
        :duration-ms="release.durationMs"
        :has-more="!release.isFullTrackList"
      />
    </div>
  </div>
  <div
    v-else-if="$screen.isMultiColumn"
    :class="$style.ReleaseDetailWrapper"
  >
    <ReleaseDate
      :release-date="release.releaseDate"
      :release-date-precision="release.releaseDatePrecision"
    />
    <ReleaseTotalTracks
      :total="release.totalTracks"
    />
    <ReleaseDuration
      :duration-ms="release.durationMs"
      :has-more="!release.isFullTrackList"
    />
    <ReleaseLabel
      :label="release.label"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import ReleaseLabel from '~/components/parts/text/ReleaseLabel.vue';
import type { App } from '~~/types';

export default Vue.extend({
  components: {
    ReleaseDate,
    ReleaseTotalTracks,
    ReleaseDuration,
    ReleaseLabel,
  },

  props: {
    release: {
      type: Object as PropType<App.ReleaseInfo>,
      required: true,
    },
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
