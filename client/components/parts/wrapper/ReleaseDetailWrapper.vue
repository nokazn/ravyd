<template>
  <div
    v-if="$window.isSingleColumn"
    :class="$style.ReleaseDetailWrapper"
  >
    <div>
      <ReleaseDate
        hide-icon
        :size="16"
        :release-date="release.releaseDate"
        :release-date-precision="release.releaseDatePrecision"
      />
      <span>
        ・{{ release.label }}
      </span>
    </div>
    <div>
      <span>
        {{ release.totalTracks }}曲・
      </span>
      <ReleaseDuration
        hide-icon
        :size="16"
        :duration-ms="release.durationMs"
        :is-full="release.isFullTrackList"
      />
    </div>
  </div>
  <div
    v-else-if="$window.isMultiColumn"
    :class="$style.ReleaseDetailWrapper"
  >
    <ReleaseDate
      subtext
      :release-date="release.releaseDate"
      :release-date-precision="release.releaseDatePrecision"
    />
    <ReleaseTotalTracks
      subtext
      :total="release.totalTracks"
    />
    <ReleaseDuration
      subtext
      :duration-ms="release.durationMs"
      :is-full="release.isFullTrackList"
    />
    <ReleaseLabel
      subtext
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
  @include smaller-than-md {
    display: flex;
    flex-direction: column;
  }
}
</style>
