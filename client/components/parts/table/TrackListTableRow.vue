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
        <favorite-button
          :is-favorited="item.isSaved"
          @on-clicked="onFavoriteButtonClicked" />
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
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import { App } from '~~/types';

export default Vue.extend({
  components: {
    TrackListTableMediaIcon,
    FavoriteButton,
  },

  props: {
    item: {
      type: Object as PropType<App.TrackDetail>,
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

  methods: {
    onMediaButtonClicked() {
      this.$emit('on-media-button-clicked', this.item);
    },
    onFavoriteButtonClicked() {
      this.$emit('on-favorite-button-clicked', this.item);
    },
  },
});
</script>

<style lang="scss" module>
.TrackListTableRow {
  &[data-is-track-set=true] {
    background-color: lighten($g-data-table-background-color, 15%);
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
