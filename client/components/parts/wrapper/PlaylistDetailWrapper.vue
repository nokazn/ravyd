<template>
  <div
    v-if="$screen.isSingleColumn"
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
    v-else-if="$screen.isMultiColumn"
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
import { defineComponent, PropType } from '@vue/composition-api';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import Followers from '~/components/parts/text/Followers.vue';
import type { App } from '~~/types';

export default defineComponent({
  components: {
    ReleaseTotalTracks,
    ReleaseDuration,
    Followers,
  },

  props: {
    playlist: {
      type: Object as PropType<App.PlaylistPage>,
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
