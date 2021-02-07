<template>
  <div :class="$style.ReleaseDetailWrapper">
    <template v-if="$screen.isSingleColumn">
      <div>
        <ReleaseTotalTracks
          :size="size"
          :total="playlist.totalTracks"
        />
        <span class="g-small-text">･</span>
        <ReleaseDuration
          :size="size"
          :duration-ms="playlist.durationMs"
        />
        <span class="g-small-text">･</span>
        <Followers
          :size="size"
          :followers="playlist.followers"
        />
      </div>
    </template>
    <template v-else-if="$screen.isMultiColumn">
      <ReleaseTotalTracks
        icon
        :size="size"
        :total="playlist.totalTracks"
      />
      <ReleaseDuration
        icon
        :size="size"
        :duration-ms="playlist.durationMs"
      />
      <Followers
        icon
        :size="size"
        :followers="playlist.followers"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import Followers from '~/components/parts/text/Followers.vue';
import type { App } from '~/entities';

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

  setup() {
    return { size: 13 };
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
