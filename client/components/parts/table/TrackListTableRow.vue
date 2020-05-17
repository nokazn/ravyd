<template>
  <v-hover #default="{ hover: isRowHovered }">
    <tr
      :class="$style.TrackListTableRow"
      :data-is-track-set="isTrackSet">
      <td
        :class="[
          $style.TrackListTableRow__id,
          'text-center'
        ]">
        <track-list-table-media-icon
          :is-hovered="isRowHovered"
          :is-playing-track="isPlayingTrack"
          :media-button-icon="mediaButtonIcon"
          :track-number="item.trackNumber"
          @on-clicked="onMediaButtonClicked" />
      </td>

      <td>
        <v-btn
          icon
          size="small">
          <v-icon :size="18">
            {{ likeIcon(item.like) }}
          </v-icon>
        </v-btn>
      </td>

      <td :class="$style.TrackListTableRow__name">
        {{ item.name }}
      </td>

      <td>
        {{ item.duration }}
      </td>

      <td>
        <v-btn
          icon
          size="small">
          <v-icon>
            mdi-dots-horizontal
          </v-icon>
        </v-btn>
      </td>
    </tr>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import TrackListTableMediaIcon, { MediaButtonIcon } from '~/components/parts/button/TrackListTableMediaButton.vue';

export type RowItem = {
  id: string
  trackNumber: number
  like: boolean
  name: string
  duration: string
}

export type LikeIcon = 'mdi-heart' | 'mdi-heart-outline';

export default Vue.extend({
  components: {
    TrackListTableMediaIcon,
  },

  props: {
    item: {
      type: Object as PropType<RowItem>,
      required: true,
    },
    isTrackSet: {
      type: Boolean,
      required: true,
    },
    isPlayingTrack: {
      type: Boolean,
      required: true,
    },
    mediaButtonIcon: {
      type: String as PropType<MediaButtonIcon>,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
  },

  computed: {
    likeIcon(): (isLiked: boolean) => LikeIcon {
      return (isLiked: boolean) => (isLiked
        ? 'mdi-heart'
        : 'mdi-heart-outline');
    },
  },

  methods: {
    onMediaButtonClicked() {
      if (this.isPlayingTrack) {
        this.$dispatch('player/pause');
      } else if (this.isTrackSet) {
        this.$dispatch('player/play');
      } else {
        const offset = { position: this.item.trackNumber - 1 };
        this.$spotifyApi.$put('/me/player/play', {
          context_uri: this.uri,
          offset,
        });
      }
    },
  },
});
</script>

<style lang="scss" module>
.TrackListTableRow {
  &[data-is-track-set=true] {
    background-color: lighten($g-data-table-background-color, 10%);
    .TrackListTableRow__name {
      color: map-get($cyan, 'accent-3')
    }
  }
  &__id {
    width: 60px;
  }
}
</style>

<style lang="scss">
tr {
  td {
    padding: 0 12px;
  }
}
</style>
