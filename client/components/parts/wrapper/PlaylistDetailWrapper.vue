<template>
  <div
    v-if="$window.isSingleColumn"
    :class="$style.ReleaseDetailWrapper"
  >
    <div>
      <ReleaseTotalTracks
        hide-icon
        :total="playlist.totalTracks"
      />
      <span class="g-small-text">･</span>
      <ReleaseDuration
        hide-icon
        :duration-ms="playlist.durationMs"
      />
      <span class="g-small-text">･</span>
      <Followers
        v-if="playlist.followersText != null"
        hide-icon
        :text="playlist.followersText"
      />
    </div>
  </div>
  <div
    v-else-if="$window.isMultiColumn"
    :class="$style.ReleaseDetailWrapper"
  >
    <ReleaseTotalTracks
      :total="playlist.totalTracks"
    />
    <ReleaseDuration
      :duration-ms="playlist.durationMs"
    />
    <Followers
      v-if="playlist.followersText != null"
      :text="playlist.followersText"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import Followers from '~/components/parts/text/Followers.vue';
import type { App } from '~~/types';

export default Vue.extend({
  components: {
    ReleaseTotalTracks,
    ReleaseDuration,
    Followers,
  },

  props: {
    playlist: {
      type: Object as PropType<App.PlaylistInfo>,
      required: true,
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseDetailWrapper {
  @include smaller-than-md() {
    display: flex;
    justify-content: center;
  }

  @include larger-than-md() {
    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
